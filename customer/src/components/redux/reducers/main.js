import { getProductsReducers } from "./Productreducer";

import {combineReducers} from "redux";

const rootreducers = combineReducers({
    getproductsdata : getProductsReducers
});

export default rootreducers;

//create combined reducer fuction
// export here and set in store