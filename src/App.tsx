import React from "react";
import './App.css';
import { useAuth} from "./react-oidc-context";
import axios from "axios";
import copy from "copy-to-clipboard";  
import ReactJson from "react-json-view";




function App() {
  const auth = useAuth();
  


  const [Public, setPublic] = React.useState("");
  const [Private, setPrivate] = React.useState(null);
  const [Admin, setAdmin] = React.useState(null);

  const [AccessTokenPayload, setAccessTokenPayload] = React.useState(undefined);



    async function handlePublic () {
        const token = auth.user?.access_token;
        let reqInstance = axios.create({
          headers: {
            Authorization : `Bearer ${token}`
            }
          });

        const apiPublic = "https://localhost:7160/api/Test/Public";

        await reqInstance
          .get(apiPublic)
          .then((response) => {
              console.log(response);
              setPublic(response.data);
          })
          .catch((error) => {
              console.log(error);
          });

    }

    async function handlePrivate() {
      try {
        const response = await fetch("https://localhost:7160/api/Test/Private");
        console.log(response);
        alert(await response.json());
      } catch (e) {
        console.error(e);
      }
    }

    async function handleAdmin() {
      
      const token = auth.user?.access_token;
        let reqInstance = axios.create({
          headers: {
            Authorization : `Bearer ${token}`
            }
          });
      
        const apiAdmin = "https://localhost:7160/api/Test/Admin";

        await reqInstance
            .get(apiAdmin)
            .then((response) => {
                console.log(response);
                setAdmin(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const copyToClipboard = () => {
      copy(auth.user?.access_token ?? "Null");
    }


    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        return (
        <div>
            Hello {auth.user?.profile.sub}{" "}

            <button
            type="button"
            className="btn btn-primary"
            onClick={() =>handlePublic()}>Public</button>

            {Public && <p>{Public}</p>}

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => handlePrivate()}>Private</button>

            {Private && <p>{Private}</p>}

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleAdmin()}>Admin</button>

            {Admin && <p>{Admin}</p>}

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => copyToClipboard()}
            >
              Access Token
            </button>

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => setAccessTokenPayload(auth.user?.accessTokenPayload)}
            >
              Access Token Payload
            </button>
            
            <button onClick={() => void auth.removeUser()}>Log out</button>

            {
              AccessTokenPayload && 
              <ReactJson 
                src={AccessTokenPayload} 
                style = {{
                          borderStyle: "solid",
                          borderWidth: "5px",
                          borderColor: "blue",
                          borderRadius: "8px",
                          margin : "2%",
                          padding : "2%"
                        }}
              />
            }

        </div>
        );
    }

    return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}

export default App;
