import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useRef, useState } from 'react';
import { USE_BROWSER_ROUTER } from "./common/constants.ts";
import GlobalHeader from "./components/global-header.tsx";
import HomePage from "./pages/home.tsx";
import "./styles/app.scss";
import NotFound from "./pages/not-found.tsx";
import  ProfilePage  from './pages/profile.tsx';
import Catalog1 from "./pages/catalog1.tsx";
import Catalog2 from "./pages/catalog2.tsx";
import Catalog3 from "./pages/catalog3.tsx";



import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css'

Amplify.configure(outputs);

export default function App() {
  const Router = USE_BROWSER_ROUTER ? BrowserRouter : HashRouter;

  return (
    <Authenticator>
      {({ signOut }) => (
    <div style={{ height: "100%" }}>
      <Router>
        <GlobalHeader />
        <div style={{ height: "56px", backgroundColor: "#000716" }}>&nbsp;</div>
        <div>
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage user="reinvent" />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/catalog1" element={<Catalog1 />} />
            <Route path="/catalog2" element={<Catalog2 />} />
            <Route path="/catalog3" element={<Catalog3 />} />
          </Routes>
        </div>
      </Router>
      <button onClick={signOut}>Sign out</button>
    </div>
      )}
    </Authenticator>
  );
}
