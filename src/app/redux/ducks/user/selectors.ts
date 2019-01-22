/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { RootState } from '../../types';
import { User } from '../../../interfaces/User';
import { Log } from '../../../interfaces/Log';

// Selectors
export const selectUser = (state: RootState): User | null => state.user.user;
export const selectIsFetchingUser = (state: RootState): boolean => state.user.IsFetchingUser;
export const selectIsFetchingUserLogs = (state: RootState): boolean => state.user.IsFetchingLogs;
export const selectUserLogs = (state: RootState): Log[] => state.user.logs;
export const selectUserLogCount = (state: RootState): number => state.user.logCount;
export const selectCurrentUser = (state: RootState): User | null => state.user.current;
