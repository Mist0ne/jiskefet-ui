/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { SubsystemOverview } from '../interfaces/SubsystemOverview';
import State from './State';
import { HttpError } from '../interfaces/HttpError';
import * as m from 'mithril';

/**
 * Stores the state around SubsystemOverview entities and contains api calls to change that state.
 */
const SubsystemOverviewModel = {
    isFetchingSubsystemOverviews: false as boolean,
    list: [] as SubsystemOverview[],
    async fetch() {
        this.isFetchingSubsystemOverviews = true;
        return m.request({
            method: 'GET',
            url: `${process.env.API_URL}overview`,
            withCredentials: false
        }).then((result: SubsystemOverview[]) => {
            this.isFetchingSubsystemOverviews = false;
            this.list = result;
        }).catch((e: HttpError) => {
            this.isFetchingSubsystemOverviews = false;
            State.HttpErrorModel.add(e);
        });
    },
};

type SubsystemOverviewModel = typeof SubsystemOverviewModel;
export default SubsystemOverviewModel;
