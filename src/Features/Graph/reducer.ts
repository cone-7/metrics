import { createSlice, PayloadAction } from 'redux-starter-kit';

type Measure = {
  at: number;
  value: number;
  metric: string;
};

export type IMeasurements = {
  metric: string;
  measurements: Array<Measure>
}

export type IMetricsDataPayload = {
  getMultipleMeasurements: Array<IMeasurements>
}


export interface IMetricData {
  metric: string;
  value: number;
}

type IMetricsData = {
  metricsData: Array<IMetricData>
}

export type ApiErrorAction = {
  error: string;
};

const initialState: IMetricsData = {
  metricsData: []
};

const slice = createSlice({
  name: 'metricsData',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<IMetricsDataPayload>) => {
      const measures = action.payload.getMultipleMeasurements.map(mes => {
        return {
          metric: mes.metric,
          value: mes.measurements.length > 0 ? mes.measurements[mes.measurements.length-1].value : 0
        }
      });
      state.metricsData = measures;
    },
    metricsDataApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
