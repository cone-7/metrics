import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import React, { MouseEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import { IState } from '../../store';
import { actions } from './reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
  query {
      getMetrics
  }
`;

const getMetrics = (state: IState) => {
  return {
    getMetrics: state.metrics.getMetrics,
    metricsSelected: state.metrics.metricsSelected
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const useStyles = makeStyles({
  chip: {
      backgroundColor: '#3498db',
      marginRight: 20,
      '&:hover': { backgroundColor: '#3498db' },
      '&:focus': { backgroundColor: '#3498db' },
  },
  chipSelected: {
      backgroundColor: '#77bff0',
      marginRight: 20,
      '&:hover': { backgroundColor: '#77bff0' },
      '&:focus': { backgroundColor: '#77bff0' },
  }
});

const Metrics = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(getMetrics);
  const classes = useStyles();

  const [result] = useQuery({
    query
  });
  const { fetching, data, error } = result;

  const toggleChip = (e: MouseEvent) => {
    let newSelected:any = [];
    const key = e.currentTarget.id;

    if(metrics.metricsSelected.indexOf(key) > -1){
      newSelected = metrics.metricsSelected.filter(m => m !== key)  
    } else {
      newSelected = [...metrics.metricsSelected, key];
    }
    dispatch(actions.metricsSelected(newSelected));
  };

  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.metricsDataRecevied(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  return <>
      {metrics.getMetrics.map(m => {
        const clsNme = metrics.metricsSelected.indexOf(m) > -1 ? classes.chipSelected : classes.chip;
        return <Chip key={m} id={m} className={clsNme} onClick={toggleChip} label={m}/>;
      })}
    </>
};
