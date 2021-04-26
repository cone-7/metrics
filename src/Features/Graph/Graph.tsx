import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Provider, createClient, useQuery } from 'urql';
import { actions, IMeasurements } from './reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

interface IProps{
  metrics: Array<string>
};

interface IDataGraph {
  getMultipleMeasurements: Array<IMeasurements>;
}

export default ({metrics}: IProps) => {
  const dispatch = useDispatch();
  const query = `query ($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        at
        value 
        metric
        unit
      }
    }
  }`;
  const now = useRef(new Date());
  const input = metrics.map((metric:string) => ({
    metricName: metric,
    after: now.current.getTime()
  }));
  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });
  const { data, error } = result;
  
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsDataApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.metricsDataRecevied(data));
  }, [dispatch, data, error]);

  return (
    <Provider value={client}>
      <Graph data={data} at={now.current.getTime()}/>
    </Provider>
  );
};

const Graph = ({data, at}: {data: IDataGraph; at:number}) => {
  
  const formatXAxis = (tickItem:number) => {
    if(!tickItem) return '';
    const date = new Date(tickItem);
    return date.toLocaleTimeString('en-US');
  }

  const color = ['blue', 'red', 'purple', 'green', 'black', 'orange']

  return <>
    {(data && data.getMultipleMeasurements.length > 0) && <LineChart width={1200} height={600}>
        {
          data.getMultipleMeasurements.map((m, index) => {
            return <Line key={m.metric} type="monotone" dataKey="value" stroke={color[index]} data={m.measurements}/>;
          })
        }
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="at" type="number" domain={["dataMin", "dataMax"]} tickFormatter={formatXAxis} scale="time"/>
        <YAxis scale="auto"/>
      </LineChart>}
  </>;
};
