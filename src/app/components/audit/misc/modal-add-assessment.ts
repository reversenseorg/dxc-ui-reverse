/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {Nullable} from "../../../base/Nullable";
import {AuditService} from "../ctrl/audit.service";
import {OutputService} from "../../output/ctrl/output.service";
import ControlAssessment, {AnalysisType, TestType} from "../../../models/audit/common/ControlAssessment";
import Control from "../../../models/audit/common/Control";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {Metadata, MetadataType} from "../../../models/audit/common/Metadata";

@Component({
    selector: 'dxc-modal-add-assessment',
    template: `
        <app-modal-base
                [mainController]="controller.app"
                [name]="'modal-add-assessment'"
                [width]="700"
                [height]="600"
                [closable]="true"
                (open)="onOpen($event)">

            <ng-container head>
                <h4 class="dxc-text-std">{{ title }}</h4>
                <p class="dxc-text-clear75" *ngIf="parentControl">
                    Adding assessment to: <strong>{{ parentControl.name }}</strong>
                </p>
            </ng-container>

            <ng-container body>
                <div class="container-fluid p-3">

                    <!-- ID Field -->
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label dxc-text-std">ID <span class="text-danger">*</span></label>
                        <div class="col-sm-9">
                            <input
                                    type="text"
                                    class="form-control dxc-input"
                                    [(ngModel)]="assessmentId"
                                    placeholder="e.g., ASSESS-001"
                                    required>
                            <small class="form-text dxc-text-clear75">Unique identifier for this assessment</small>
                        </div>
                    </div>

                    <!-- Name Field -->
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label dxc-text-std">Name <span class="text-danger">*</span></label>
                        <div class="col-sm-9">
                            <input
                                    type="text"
                                    class="form-control dxc-input"
                                    [(ngModel)]="assessmentName"
                                    placeholder="Assessment name"
                                    required>
                        </div>
                    </div>

                    <!-- Description Field -->
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label dxc-text-std">Description</label>
                        <div class="col-sm-9">
                    <textarea
                            class="form-control dxc-input"
                            [(ngModel)]="assessmentDescription"
                            rows="3"
                            placeholder="Describe the assessment purpose and methodology"></textarea>
                        </div>
                    </div>

                    <!-- Test Type Field -->
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label dxc-text-std">Test Type</label>
                        <div class="col-sm-9">
                            <select
                                    class="form-select dxc-input"
                                    [(ngModel)]="testType"
                                    (change)="onTestTypeChange($any($event.target).value)">
                                <option *ngFor="let type of supportedTestTypes" [value]="type.value">
                                    {{ type.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Analysis Type Field -->
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label dxc-text-std">Analysis Type</label>
                        <div class="col-sm-9">
                            <select
                                    class="form-select dxc-input"
                                    [(ngModel)]="analysisType"
                                    (change)="onAnalysisTypeChange($any($event.target).value)">
                                <option *ngFor="let type of supportedAnalysisTypes" [value]="type.value">
                                    {{ type.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Links Field -->
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label dxc-text-std">Links</label>
                        <div class="col-sm-9">
                            <input
                                    type="text"
                                    class="form-control dxc-input"
                                    [(ngModel)]="assessmentLinks"
                                    placeholder="https://example.com/reference">
                            <small class="form-text dxc-text-clear75">Reference URLs (comma-separated)</small>
                        </div>
                    </div>

                    <!-- Metadata Section -->
                    <div class="row mb-3">
                        <label class="col-sm-3 col-form-label dxc-text-std">Metadata</label>
                        <div class="col-sm-9">
                            <!-- Existing metadata -->
                            <div *ngIf="metadata.length > 0" class="mb-2">
                                <div *ngFor="let meta of metadata; let i = index" class="d-flex align-items-center mb-1">
                                    <span class="badge bg-secondary me-2">{{ meta.key }}: {{ meta.value }}</span>
                                    <button
                                            type="button"
                                            class="btn btn-sm btn-danger"
                                            (click)="removeMetadata(i)">
                                        <fa-icon [icon]="['fas','xmark']"></fa-icon>
                                    </button>
                                </div>
                            </div>

                            <!-- Add new metadata -->
                            <div class="input-group">
                                <input
                                        type="text"
                                        class="form-control dxc-input"
                                        [(ngModel)]="newMetaKey"
                                        placeholder="Key">
                                <input
                                        type="text"
                                        class="form-control dxc-input"
                                        [(ngModel)]="newMetaValue"
                                        placeholder="Value">
                                <button
                                        type="button"
                                        class="btn btn-primary"
                                        (click)="addMetadata()">
                                    <dxc-icon [model]="gIcons['PLUS']"></dxc-icon> Add
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </ng-container>

            <ng-container footer>
                <div class="d-flex justify-content-end p-2">
                    <button
                            type="button"
                            class="btn btn-secondary me-2"
                            (click)="close()">
                        Cancel
                    </button>
                    <button
                            type="button"
                            class="btn btn-primary"
                            [disabled]="!isFormValid()"
                            (click)="save()">
                        <dxc-icon [model]="gIcons['SAVE']"></dxc-icon> Save Assessment
                    </button>
                </div>
            </ng-container>

        </app-modal-base>
    `,
    styleUrls: ['../../../modal.scss', '../../../forms.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalAddAssessmentComponent extends AbstractKeyboardNavigable implements OnInit, AfterViewInit {

    @Input() controller: any;
    @Input() title: Nullable<string> = "Add Control Assessment";

    @ViewChild(ModalBaseComponent) modal: ModalBaseComponent;

    @Output() onAssessmentCreated: EventEmitter<ControlAssessment> = new EventEmitter<ControlAssessment>();

    gIcons: any = GLOBAL_ICONS;

    // Parent control
    parentControl: Nullable<Control> = null;

    // Form fields
    assessmentId: string = "";
    assessmentName: string = "";
    assessmentDescription: string = "";
    assessmentLinks: string = "";
    testType: TestType = TestType.VT;
    analysisType: AnalysisType = AnalysisType.SAST;
    metadata: Metadata[] = [];

    // New metadata entry
    newMetaKey: string = "";
    newMetaValue: string = "";

    // Supported types
    supportedTestTypes: { value: TestType, label: string }[] = [
        {value: TestType.VT, label: 'Vulnerability Test'},
        {value: TestType.PT, label: 'Penetration Test'}
    ];

    supportedAnalysisTypes: { value: AnalysisType, label: string }[] = [
        {value: AnalysisType.SAST, label: 'Static Analysis (SAST)'},
        {value: AnalysisType.DAST, label: 'Dynamic Analysis (DAST)'},
        {value: AnalysisType.IAST, label: 'Interactive Analysis (IAST)'}
    ];

    constructor(
        public auditSvc: AuditService,
        private _outputSvc: OutputService,
        private _changeDetector: ChangeDetectorRef,
        private kbSvc: KeyboardNavigationService
    ) {
        super();
    }

    ngOnInit(): void {
        this.kbSvc.register(this);
    }

    ngAfterViewInit(): void {
        this.auditSvc.openEditor$.subscribe((event) => {
            if (event.type === 'assess') {
                this.parentControl = event.parent;
                this.resetForm();
                this.modal.show();
            }
        });
    }

    onKeyPress(pEvent: any) {
        switch (pEvent.code) {
            case "Escape":
                this.modal.hide('close');
                break;
        }
    }

    show(pControl: Control) {
        this.parentControl = pControl;
        this.resetForm();
        this.modal.show();
    }

    onOpen(pEvent: any) {
        console.log("ASSESSMENT EDITOR OPENED", this.parentControl);
    }

    close() {
        this.modal.hide('close');
    }

    resetForm() {
        this.assessmentId = "";
        this.assessmentName = "";
        this.assessmentDescription = "";
        this.assessmentLinks = "";
        this.testType = TestType.VT;
        this.analysisType = AnalysisType.SAST;
        this.metadata = [];
        this.newMetaKey = "";
        this.newMetaValue = "";
        this._changeDetector.markForCheck();
    }

    addMetadata() {
        if (this.newMetaKey.trim() === "" || this.newMetaValue.trim() === "") {
            this._outputSvc.alert(OutputMessage.newWarning({msg: "Metadata key and value cannot be empty"}));
            return;
        }

        this.metadata.push({
            type: MetadataType.ANY,
            key: this.newMetaKey.trim(),
            value: this.newMetaValue.trim()
        });

        this.newMetaKey = "";
        this.newMetaValue = "";
        this._changeDetector.markForCheck();
    }

    removeMetadata(index: number) {
        this.metadata.splice(index, 1);
        this._changeDetector.markForCheck();
    }

    isFormValid(): boolean {
        return this.assessmentId.trim() !== "" && 
               this.assessmentName.trim() !== "";
    }

    save() {
        if (!this.isFormValid()) {
            this._outputSvc.alert(OutputMessage.newError({msg: "ID and Name are required"}));
            return;
        }

        const newAssessment = new ControlAssessment({
            id: this.assessmentId.trim(),
            name: this.assessmentName.trim(),
            description: this.assessmentDescription.trim(),
            links: this.assessmentLinks.trim(),
            testType: this.testType,
            analType: this.analysisType,
            metadata: this.metadata,
            rules: []
        });

        if (this.parentControl) {
            this.parentControl.assessments.push(newAssessment);
            this._outputSvc.print(OutputMessage.newSuccess({
                src: "Audit",
                msg: `Assessment '${newAssessment.name}' added to control '${this.parentControl.name}'`
            }));
        }

        this.onAssessmentCreated.emit(newAssessment);
        this.modal.hide('close');
    }

    onTestTypeChange(value: TestType) {
        this.testType = value;
        this._changeDetector.markForCheck();
    }

    onAnalysisTypeChange(value: AnalysisType) {
        this.analysisType = value;
        this._changeDetector.markForCheck();
    }
}
