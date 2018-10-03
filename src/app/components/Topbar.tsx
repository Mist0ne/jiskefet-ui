import * as m from 'mithril';
import { NavItem } from './NavItem';

export class Topbar implements m.Component {
    view() {
        return (
            <div class="sticky-top">
                <nav class="navbar navbar-expand-sm navbar-dark jiskefet-navbar">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon" />
                    </button>
                    <a href="/" class="navbar-brand" oncreate={m.route.link}>
                        <img src="../../assets/cern_logo.png" width="30" height="30" class="d-inline-block align-top logo" alt="" />
                            Jiskefet
                    </a>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <NavItem href="/logs" name="Logs" />
                            <NavItem href="/runs" name="Runs" />
                            <NavItem href="/create" name="Create new run" />
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}