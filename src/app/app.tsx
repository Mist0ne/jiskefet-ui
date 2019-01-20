/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import '../scss/main.scss';
import 'bootstrap';
import Layout from './organisms/Layout';
import UnauthorizedLayout from './organisms/UnauthorizedLayout';
import Runs from './pages/Runs';
import Logs from './pages/Logs';
import Run from './pages/Run';
import CreateLog from './pages/CreateLog';
import CreateToken from './pages/CreateToken';
import * as Cookie from 'js-cookie';
import Login from './pages/Login';
import Profile from './pages/Profile';
import SubsystemsOverview from './pages/SubsystemsOverview';
import Loader from './atoms/Loader';
import { Setting } from './interfaces/Setting';
import { CronJob } from 'cron';
import LogPage from './pages/LogPage';

m.route.prefix('');
/**
 * Routes enabled when user is authenticated.
 */
const authenticatedRoutes = {
    '/': {
        view: () => (
            <Layout>
                <Logs />
            </Layout>
        ),
    },
    '/callback': {
        view: () => (
            <Layout>
                <Loader />
            </Layout>
        ),
    },
    '/logs': {
        view: () => (
            <Layout>
                <Logs />
            </Layout>
        ),
    },
    '/logs/create': {
        view: () => (
            <Layout>
                <CreateLog />
            </Layout>
        ),
    },
    '/logs/create/runs/:id': {
        view: (vnode: m.Vnode<{ id: number }>) => (
            <Layout>
                <CreateLog runNumber={vnode.attrs.id} />
            </Layout>
        ),
    },
    '/logs/:id': {
        view: (vnode: m.Vnode<{ id: number }>) => (
            <LogPage logId={vnode.attrs.id} />
        ),
    },
    '/runs': {
        view: () => (
            <Layout>
                <Runs />
            </Layout>
        ),
    },
    '/runs/:id': {
        view: (vnode: m.Vnode<{ id: number }>) => (
            <Layout>
                <Run runNumber={vnode.attrs.id} />
            </Layout>
        ),
    },
    '/subsystems': {
        view: () => (
            <Layout>
                <SubsystemsOverview />
            </Layout>
        ),
    },
    '/tokens': {
        view: () => (
            <Layout>
                <CreateToken />
            </Layout>
        ),
    },
    '/user/:userId': {
        view: (vnode: m.Vnode<{ userId: number }>) => (
            <Layout>
                <Profile userId={vnode.attrs.userId} />
            </Layout>
        ),
    }
};

/**
 * Routes enabled when user is not authenticated.
 */
const lockedOutRoutes = {
    '/': {
        view: () => (
            <UnauthorizedLayout>
                <Login />
            </UnauthorizedLayout>
        ),
    },
    '/callback': {
        view: () => (
            <UnauthorizedLayout>
                <Login />
            </UnauthorizedLayout>
        ),
    }
};
/**
 * Determine the routing table for the app, based on if the user is logged in or not.
 * (logged in is in essence: does the user have a cookie with a JWT)
 */
export const initialize = () => {
    const token = Cookie.get('token');
    if (token) {
        m.route(document.body, '/', authenticatedRoutes);
    } else {
        m.route(document.body, '/', lockedOutRoutes);
    }
};

/**
 * Creates a request to the /setting endpoint in order to retrieve settings for the authentication.
 */
export const getAuthSettings = () => {
    return m.request({
        method: 'GET',
        url: `${process.env.API_URL}setting`
    }).then((result: { data: Setting }) => {
        // setting['date'] = new Date().valueOf();
        localStorage.setItem('USE_CERN_SSO', result.data.USE_CERN_SSO);
        localStorage.setItem('AUTH_URL', result.data.AUTH_URL);
    });
};

/**
 * Schedule a daily cronjob to check if the settings are up to date.
 */
new CronJob('0 2 * * *', () => {
    getAuthSettings();
}).start();

getAuthSettings();
initialize();
