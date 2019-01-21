/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { ThunkResult, RunAction } from './types';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../../types';
import { Run } from '../../../interfaces/Run';
import { HttpError } from '../../../interfaces/HttpError';
import { request } from '../../../request';
import {
    fetchRunsRequest,
    fetchRunsSuccess,
    fetchRunRequest,
    fetchRunSuccess
} from './actions';
import { getRuns, getRun, linkLogToRunUrl } from '../../../constants/apiUrls';

// Thunks
export const fetchRuns = (query?: string): ThunkResult<Promise<void>> =>
    async (dispatch: ThunkDispatch<RootState, void, RunAction>): Promise<void> => {
        dispatch(fetchRunsRequest());
        return request({
            method: 'GET',
            url: getRuns(query)
        }).then((result: { data: Run[], count: number }) => {
            dispatch(fetchRunsSuccess(result));
        }).catch((error: HttpError) => {
            // State.HttpErrorModel.add(error);
        });
    };

export const fetchRun = (id: number | string): ThunkResult<Promise<void>> =>
    async (dispatch: ThunkDispatch<RootState, void, RunAction>): Promise<void> => {
        dispatch(fetchRunRequest());
        return request({
            method: 'GET',
            url: getRun(id)
        }).then((result: Run) => {
            dispatch(fetchRunSuccess(result));
        }).catch((error: HttpError) => {
            // State.HttpErrorModel.add(error);
        });
    };

export const linkLogToRun = (logId: number, runNumber: number): ThunkResult<Promise<void>> =>
    async (dispatch: ThunkDispatch<RootState, void, RunAction>): Promise<void> => {
        dispatch(fetchRunRequest());
        return request({
            method: 'PATCH',
            url: linkLogToRunUrl(runNumber),
            data: { logId: logId as number }
        }).then((result: Run) => {
            dispatch(fetchRunSuccess(result));
        }).catch((error: HttpError) => {
            // State.HttpErrorModel.add(error);
        });
    };
