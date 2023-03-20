import { createStore, applyMiddleware, compose } from "redux";
import { rootReducer } from "./rootReducer";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
  };
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, compose(applyMiddleware(thunk)));

const persistor = persistStore(store);
export { store, persistor };