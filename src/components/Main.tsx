import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Metrics from '../Features/Metrics/Metrics';
import { useSelector } from 'react-redux';
import { IState } from '../store';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { Provider, createClient } from 'urql';
import Graph from '../Features/Graph/Graph';

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles({
    root: {
      maxWidth: 275,
      display: 'inline-block',
      margin: 20,
    },
    cards: {
        paddingBottom: 25
    },
    value: {
        paddingTop: 10,
        fontWeight: "bold"
    }
});

export default () => {
    return (
      <Provider value={client}>
        <Main />
      </Provider>
    );
  };

const metricsDataReducer = (state: IState) => {
    return {
      metricsData: state.metricsData,
    };
};

const Main = () => {
    const classes = useStyles();
    const metricsData = useSelector(metricsDataReducer);

    const getMetrics = (state: IState) => {
        return {
          metricsSelected: state.metrics.metricsSelected
        };
    };

    const metrics = useSelector(getMetrics);

    return (
        <div >
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Metrics></Metrics>
                </Toolbar>
            </AppBar>
            <div className={classes.cards}>
                {metricsData.metricsData.metricsData.map((metric:{metric: string,value: number}) => {
                    return <Card className={classes.root} key={metric.metric}>
                        <CardContent>
                            {metric.metric}<br></br>
                            <div className={classes.value}>{metric.value}</div>
                        </CardContent>
                    </Card>
                })}
            </div>
            {metrics.metricsSelected && <Graph metrics={metrics.metricsSelected}></Graph>}
        </div>
    )
}