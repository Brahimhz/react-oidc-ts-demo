import React from "react";
import './App.css';
import { useAuth} from "./react-oidc-context";
import axios from "axios";



function App() {
  const auth = useAuth();
  


  const [Public, setPublic] = React.useState("");
  const [Private, setPrivate] = React.useState(null);
  const [Admin, setAdmin] = React.useState(null);


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

            <button onClick={() => void auth.removeUser()}>Log out</button>
        </div>
        );
    }

    return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}

export default App;
