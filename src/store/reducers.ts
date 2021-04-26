import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as metricsDataReducer } from '../Features/Graph/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  metricsData: metricsDataReducer
};
