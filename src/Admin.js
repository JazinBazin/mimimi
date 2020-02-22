import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import authProvider from './AuthProvider';

const dataProvider = simpleRestProvider("http://localhost:3000/api");

const AdminPanel = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource name="articles" list={ListGuesser} />
    </Admin>
);

export default AdminPanel;