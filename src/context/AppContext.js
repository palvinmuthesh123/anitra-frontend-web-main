import React, { createContext, useContext, useState } from "react";
// import cogoToast from "cogo-toast";

const appContext = createContext({});

export function AppContextProvider(props) {
  const loginStatus = JSON.parse(
    localStorage.getItem("loginStatus") || "false"
  );

  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const { children } = props;
  const localData = JSON.parse(localStorage.getItem("appData") || "{}");
  const [state, setState] = useState(localData);
  const [loader, setLoader] = useState(false);

  const setGlobalState = (data, cb) => {
    const setData = { ...localData, ...(data || {}) };
    localStorage.setItem("appData", JSON.stringify(setData));
    setState(setData);
  };

  const [popUpSelectedData, setPopUpSelectedData] = React.useState(null);
  const [isLoggedIn, setLoginStatus] = React.useState(loginStatus);
  const [user, setUser] = React.useState(userData);

  const [filterQuery, setFilterQuery] = useState({
    postCode: "",
    searchString: "",
  });

  const handleLoginSuccess = (data) => {
    localStorage.setItem("loginStatus", "true");
    localStorage.setItem("user", JSON.stringify(data));
    setLoginStatus(true);
    setUser(data);
  };

  const handleLogoutSuccess = () => {
    localStorage.setItem("loginStatus", "false");
    localStorage.setItem("user", JSON.stringify({}));
    setLoginStatus(false);
    setUser({});
  };

  const handleLocationSelection = (data) => {
    setFilterQuery({
      ...data,
      postCode: data.postcode,
      searchString: data.searchString,
    });
  };

  return (
    <appContext.Provider
      value={{
        globalState: state,
        setGlobalState,
        loader,
        setLoader,
        popUpSelectedData,
        setPopUpSelectedData,
        isLoggedIn,
        handleLoginSuccess: handleLoginSuccess,
        handleLogoutSuccess: handleLogoutSuccess,
        handleLocationSelection: handleLocationSelection,
        user,
        setUser: setUser,
        filterQuery,
      }}
    >
      {children}
    </appContext.Provider>
  );
}

export function useAppContext() {
  return useContext(appContext);
}
