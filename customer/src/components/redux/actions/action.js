//api async call hai isiliye redux thunk middleware use kia hai

export const getProducts = () => async (dispatch) => {
  try {
    const data = await fetch("/getproducts",{
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      }
    });
    const res = await data.json();
    console.log(res);
    dispatch({type:"SUCCESS_GET_PRODUCTS",payload:res})//we can write any variable name in place of payload
  } catch (error) {
    dispatch({type:"FAIL_GET_PRODUCTS",payload:error.response})
  }
};

// jis component me getProducts ka data chahiye waha call karenge