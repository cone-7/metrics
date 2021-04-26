import { createSlice, PayloadAction } from 'redux-starter-kit';

export type IMetricsPayload = {
  getMetrics: Array<string>,
  metricsSelected: Array<string>
}

export type ApiErrorAction = {
  error: string;
};

const initialState: IMetricsPayload = {
  getMetrics: [],
  metricsSelected: []
};


const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<IMetricsPayload>) => {
      state.getMetrics = action.payload.getMetrics;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    metricsSelected: (state, selectedMetrics: { payload: Array<string> }) => {
      state.metricsSelected = selectedMetrics.payload
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
