/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { Attachment } from './Attachment';
import { User } from './User';

/**
 * Interface with the fields for fetching one or more Log entries.
 */
export interface Log {
    logId: number;
    subtype: string;
    userId?: number;
    origin: string;
    creationTime: string;
    title: string;
    text: string;
    user: User;
    runs?: any[];
    attachments?: any[];
}

/**
 * Interface with the fields for creating a Log entry.
 */
export interface LogCreate {
    logId?: number;
    subtype: string;
    origin: string;
    title: string;
    text: string;
    user: User;
    runs: any[];
    attachments?: Attachment[];
}
