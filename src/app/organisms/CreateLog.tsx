/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import { IEvent } from '../interfaces/Event';
import Modal from '../atoms/Modal';
import MarkdownViewer from '../atoms/MarkdownViewer';
import MarkdownHelpText from '../constants/MarkdownHelpText';
import AttachmentComponent from '../molecules/Attachment';
import { selectProfile } from '../redux/ducks/auth/selectors';
import { store } from '../redux/configureStore';
import { ILogCreate, ILog } from '../interfaces/Log';
import { createLog, fetchLog, createComment } from '../redux/ducks/log/operations';
import { selectLogToBeCreated, selectCurrentLog } from '../redux/ducks/log/selectors';
import { clearLogToBeCreated, setLogToBeCreated } from '../redux/ducks/log/actions';
import MarkdownEditor from '../atoms/MarkdownEditor';
import TabContainer from '../molecules/TabContainer';
import Input, { InputSize } from '../atoms/Input';
import Label from '../atoms/Label';
import Select from '../atoms/Select';
import FormGroup from '../molecules/FormGroup';
import Button, { ButtonType, ButtonClass } from '../atoms/Button';
import HttpErrorAlert from '../atoms/HttpErrorAlert';

interface Attrs {
    runNumber?: number | undefined;
    logNumber?: number | undefined;
}

type Vnode = m.Vnode<Attrs, CreateLog>;

export default class CreateLog extends MithrilTsxComponent<Attrs> {

    oninit() {
        store.dispatch(clearLogToBeCreated());
    }

    setValueForLogToBeCreated = (key: string, value: any) => {
        let logToBeCreated = selectLogToBeCreated(store.getState()) as ILogCreate | {};
        if (!logToBeCreated) {
            logToBeCreated = {};
        }
        logToBeCreated = { ...logToBeCreated, [key]: value };
        if (logToBeCreated) {
            store.dispatch(setLogToBeCreated(logToBeCreated as ILogCreate));
        }
    }

    fetchParentLog = async (logNumber: number): Promise<ILog | null> => {
        await store.dispatch(fetchLog(logNumber));
        return selectCurrentLog(store.getState());
    }
    addToCreateLog = (event: IEvent) => {
        this.setValueForLogToBeCreated(event.target.id, event.target.value);
    }

    addDescription = (content: string) => {
        this.setValueForLogToBeCreated('body', content);
    }

    async saveLog(runNumber: number | undefined, logNumber: number | undefined) {
        const parentLog = logNumber && await this.fetchParentLog(logNumber);

        if (runNumber) {
            this.setValueForLogToBeCreated('run', runNumber);
        }
        console.log('Create comment for root:');
        console.log(parentLog && parentLog.commentFkRootLogId);
        if (logNumber) {
            this.setValueForLogToBeCreated('parentId', logNumber);
            this.setValueForLogToBeCreated('rootId', parentLog && parentLog.commentFkRootLogId);
        }
        const profile = selectProfile(store.getState());
        if (profile) {
            this.setValueForLogToBeCreated('user', profile.userData.userId);

            const logToBeCreated = selectLogToBeCreated(store.getState());
            if (logToBeCreated && !logNumber) {
                await store.dispatch(createLog(logToBeCreated));
                store.dispatch(clearLogToBeCreated());
            } else if (logToBeCreated && !runNumber) {
                await store.dispatch(createComment(logToBeCreated));
                store.dispatch(clearLogToBeCreated());
            }
            m.route.set('/Logs');
        }
    }

    view(vnode: Vnode) {
        const logToBeCreated = selectLogToBeCreated(store.getState());
        return (
            <HttpErrorAlert>
                <form
                    onsubmit={(event: IEvent) => {
                        event.preventDefault();
                        this.saveLog(vnode.attrs.runNumber, vnode.attrs.logNumber);
                    }}
                >
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-12 mx-auto bg-light rounded p-4 shadow-sm">
                                <div>
                                    <h3>
                                        {`Create a new log ${vnode.attrs.runNumber ?
                                            `for run number ${vnode.attrs.runNumber}` :
                                            ''}`}
                                    </h3>
                                </div>
                                <FormGroup
                                    label={(
                                        <Label id="title" text="Add a title:" />
                                    )}
                                    field={(
                                        <Input
                                            id="title"
                                            inputType="text"
                                            className="form-control"
                                            inputSize={InputSize.MEDIUM}
                                            placeholder="Title"
                                            required={true}
                                            oninput={this.addToCreateLog}
                                        />
                                    )}
                                />
                                <FormGroup
                                    label={(
                                        <Label id="subtype" text="Select a subtype:" />
                                    )}
                                    field={(
                                        <Select
                                            id="subtype"
                                            className="form-control"
                                            inputSize={InputSize.MEDIUM}
                                            name="subtype"
                                            required={true}
                                            oninput={this.addToCreateLog}
                                            options={vnode.attrs.logNumber ? ['comment'] : ['run']}
                                        />
                                    )}
                                />
                                <FormGroup
                                    hidden={!vnode.attrs.runNumber}
                                    label={(
                                        <Label id="run" text="Run number:" />
                                    )}
                                    field={(
                                        <Input
                                            id="run"
                                            inputType="number"
                                            className="form-control"
                                            inputSize={InputSize.MEDIUM}
                                            placeholder="Run number"
                                            required={false}
                                            oninput={this.addToCreateLog}
                                            value={vnode.attrs.runNumber && vnode.attrs.runNumber}
                                        />
                                    )}
                                />
                                <FormGroup
                                    field={(
                                        <div class="card shadow-sm bg-light">
                                            <TabContainer titles={['Editor', 'Preview']} >
                                                <MarkdownEditor
                                                    postContent={(content: string) => this.addDescription(content)}
                                                />
                                                <MarkdownViewer
                                                    id={'MarkdownPreview'}
                                                    content={logToBeCreated && logToBeCreated.body || ''}
                                                />
                                            </TabContainer>
                                        </div>
                                    )}
                                />
                                <AttachmentComponent
                                    attachTo="Log"
                                    hideImagePreview={true}
                                    isExistingItem={false}
                                />
                                <br />
                                <div class="row">
                                    <div class="col-md-6">
                                        <Button
                                            buttonType={ButtonType.SUBMIT}
                                            buttonClass={ButtonClass.DEFAULT}
                                            text="Submit"
                                        />
                                    </div>
                                    <div class="col-md-6">
                                        <Modal
                                            id="MarkdownHelpText"
                                            title="Markdown help"
                                            buttonClass="btn btn-info mb-"
                                        >
                                            <MarkdownViewer id={'MarkdownHelpTextViewer'} content={MarkdownHelpText} />
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </HttpErrorAlert>
        );
    }
}
