import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, UntypedFormGroup, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { FarmService } from 'src/app/shared/services/farm.service';

@Component({
  selector: "app-create-farm",
  templateUrl: "./create-project.component.html",
  styleUrls: ["./create-project.component.scss"],
})
export class CreateProjectComponent implements OnInit {
  [x: string]: any;
  StepCation = 'Week'
  addFarm: FormGroup;
  addIndustry: UntypedFormGroup;
  addRole: UntypedFormGroup;
  addSubject: UntypedFormGroup;
  addGrade: UntypedFormGroup;
  addTool: UntypedFormGroup;
  weeksArray = new UntypedFormArray([]);
  currentStep = 1;
  selectedImages: string[] = [];
  selectedIndustryItem: any;
  selectedRoleItem: any;
  selectedGradeItem: any;
  selectedSubjectItem: any;
  selectedToolItem: any;
  selectedWeek: number;

  IndustryList = [];
  RoleList = [];
  GradeList = [];
  SubjectList = [];
  ToolList = [];
  createIndustry = false;
  createRole = false;
  createSubject = false;
  createGrade = false;
  createTool = false;
  isCollapsed: boolean[] = [];
  updateFarm: any;
  update: boolean;
  CurriculumPoints: any;
  ProjectTile: any;
  Description: any;
  PrerequisiteLearnings: any;
  id: any;

  constructor(private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private farmService: FarmService
    ,protected route: ActivatedRoute,
    protected popupController: PopupControllerService,
  ) {}

  ngOnInit() {
    let data;
    if (this.route.snapshot.paramMap.get("updateFarm")) {
      // if this components is called via routing
      this.updateFarm = this.route.snapshot.paramMap.get("updateFarm");

    } else {

      data = this.popupController.getParams();
    }
    if (data == null) {
      this.updateFarm = false;
    }
    else {
      this.updateFarm = data[0];

    }
    debugger;
    this.loadCombos();
    if (this.updateFarm) {
      this.update = true;
      console.log("DATAA", this.updateFarm)
      this.id = this.updateFarm.projectId;
      this.StepCation = this.updateFarm.projectWeek[0].step_caption;
      this.CurriculumPoints = this.updateFarm.curriculumPoints;
      this.ProjectDuration = this.updateFarm.projectDuration;
      this.IndustrySpecificProblem = this.updateFarm.industrySpecificProblem;
      this.ProjectTile = this.updateFarm.projectName;
      this.Description = this.updateFarm.projectDescription;
      this.PrerequisiteLearnings = this.updateFarm.tehsil;
      this.selectedImages = this.updateFarm.projectImagesList.map(imageObj => imageObj.image);
      this.selectedIndustryItem = this.updateFarm.projectIndustry.map(industry => ({
        id: industry.industry_id, 
        name: industry.industry_name
      }));

      this.selectedGradeItem = this.updateFarm.projectGrades.map(industry => ({
        id: industry.grade_id, 
        name: industry.grade_name
      }));

      this.selectedRoleItem = this.updateFarm.projectRole.map(industry => ({
        id: industry.role_id, 
        name: industry.role_name
      }));
      this.selectedSubjectItem = this.updateFarm.projectSubject.map(industry => ({
        id: industry.subject_id, 
        name: industry.subject_name
      }));

      (this.updateFarm.projectWeek || []).forEach(val => {
        this.addMultiWeek(val);
      });
    } else {
      this.addMultiWeek();
    }
    this.addFarm = this.formBuilder.group({
      ProjectTile: [this.ProjectTile, Validators.required],
      Description: [this.Description],
      Industry: [''],
      IndustrySpecificProblem : [this.IndustrySpecificProblem],
      ProjectDuration : [this.ProjectDuration],
      GradeLevel: ['', Validators.required],
      PrerequisiteLearnings: [this.PrerequisiteLearnings, Validators.required],
      CurriculumPoints: [this.CurriculumPoints],
      selectedIndustry: [this.selectedIndustry, Validators.required],
      selectedRole: [[], Validators.required],
      selectedGrade: [[], Validators.required],
      selectedSubject: [[], Validators.required],
      section :[this.StepCation],
      weeks: this.weeksArray
    });

    this.addIndustry = this.formBuilder.group({
      industryName: ['', Validators.required],
    });
    this.addRole = this.formBuilder.group({
      roleName: ['', Validators.required],
    });
    this.addSubject = this.formBuilder.group({
      subjectName: ['', Validators.required],
    });
    this.addGrade = this.formBuilder.group({
      gradeName: ['', Validators.required],
    });
    this.addTool = this.formBuilder.group({
      ToolName: ['', Validators.required],
    });
  }
  addMultiWeek(val = null): void {
    debugger;
  
    // Map selected tools from val.tools, assuming it contains an array of tools
    this.selectedToolItem = val?.projectTools?.map(tool => ({
      id: tool.toolId, 
      name: tool.toolName
    })) || [];
  
    // Create a new FormGroup for each week
    this.weeksArray.push(new UntypedFormGroup({
      objectives: new UntypedFormControl(val?.objectives || '', [
        // Validators for objectives can be added here
        // Validators.maxLength(12),
      ]),
      lessonPlan: new UntypedFormControl(val?.lesson_plan || '', [
        // Validators for lesson plan can be added here
        // Validators.maxLength(12),
      ]),
      weekId: new UntypedFormControl(val?.week_id || 0, [
        // Validators for weekId can be added here
        // Validators.maxLength(12),
      ]),
      selectedTool: new UntypedFormControl(this.selectedToolItem, [
        // Validators for selected tools can be added here
      ]),
      activities: new UntypedFormControl(val?.activities || '', [
        // Validators for activities can be added here
        // Validators.maxLength(12),
      ]),
    }));
  
    // Track the collapsed state for each week (default to false)
    this.isCollapsed.push(false);
  }
  
  loadCombos() {
    this.farmService.loadCombos().subscribe((response) => {
      this.GradeList = response.dataObject.gradeList;
      this.SubjectList = response.dataObject.subjectList;
      this.IndustryList = response.dataObject.industryList;
      this.RoleList = response.dataObject.roleList;
      this.ToolList = response.dataObject.toolList;
      debugger;
      // Add the 'Create New' option to each list
      this.GradeList.push({ id: -1, name: 'Create New' });
      this.SubjectList.push({ id: -1, name: 'Create New' });
      this.IndustryList.push({ id: -1, name: 'Create New' });
      this.RoleList.push({ id: -1, name: 'Create New' });
      this.ToolList.push({ id: -1, name: 'Create New' });
    });
  }

  // Getter for weeks FormArray
  get weeks(): FormArray {
    return this.addFarm.get('weeks') as FormArray;
  }

  // Create a new week FormGroup
  newWeek(): FormGroup {
    return this.formBuilder.group({
      lessonPlan: [null, Validators.required],
      
      objectives: [null, Validators.required],
      activities: [null],
      selectedTool: [[], Validators.required]
    });
  }

  // Add a week to the FormArray
  addWeek() {
    this.weeks.push(this.newWeek());
    this.isCollapsed.push(false);
  }

  // Remove a week from the FormArray
  removeWeek(index: number) {
    this.weeks.removeAt(index);
    this.isCollapsed.splice(index, 1);
  }

  // Move to the next step
  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  // Go back to the previous step
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Handle file selection
  onFileChange(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  // Remove selected image
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  // Submit form
  onSubmit() {
    debugger;
    this.showLoader();          
    const requestPayload = this.buildRequestPayload();

    if (this.updateFarm) {

      this.farmService.updateFarm(requestPayload).subscribe((response) => {
         this.showProjectUpdatedAlert();
      });
    }
    else{
      this.farmService.createFarm(requestPayload).subscribe((response) => {
        this.showProjectCreatedAlert();
      });
    }
    this.hideLoader();   
  }

  // Function to handle "Create New Industry"
  createNewIndustry(event: Event) {
    this.createIndustry = true;
  }
  createNewTool(event: Event) {
    this.createTool = true;
  }
  
  createNewRole(event: Event) {
    this.createRole = true;
  }
  createNewGrade(event: Event) {
    this.createGrade = true;
  }
  createNewSubject(event: Event) {
    this.createSubject = true;
  }
  
  
  // Submit new Industry
  onSubmitIndustry() {
    const newIndustry = { id: this.IndustryList.length + 1, name: this.addIndustry.value.industryName,type:'Industry' };
    this.farmService.createMetaData(newIndustry).subscribe((response) => {
      newIndustry.id = response.dataObject;
      this.IndustryList = [...this.IndustryList.filter(item => item.id !== -1), newIndustry, { id: -1, name: 'Create New' }];
      this.selectedIndustryItem = [
        ...(this.selectedIndustryItem || []).filter(item => item.id !== -1),
        newIndustry
      ];
      this.addFarm.get('selectedIndustry').setValue(this.selectedIndustryItem);
      this.createIndustry = false;
    });
  }

  // Submit new Role
  onSubmitRole() {
    const newRole = { id: this.RoleList.length + 1, name: this.addRole.value.roleName,type:'Role' };
    this.farmService.createMetaData(newRole).subscribe((response) => {
      newRole.id = response.dataObject;
      this.RoleList = [...this.RoleList.filter(item => item.id !== -1), newRole, { id: -1, name: 'Create New' }];
      this.selectedRoleItem = [...(this.selectedRoleItem || []).filter(item => item.id !== -1), newRole];
      this.addFarm.get('selectedRole').setValue(this.selectedRoleItem);
      this.createRole = false;
    });
  }

  // Submit new Grade
  onSubmitGrade() {
    const newGrade = { id: this.GradeList.length + 1, name: this.addGrade.value.gradeName,type:'Grade' };
    this.farmService.createMetaData(newGrade).subscribe((response) => {
      newGrade.id = response.dataObject;
      this.GradeList = [...this.GradeList.filter(item => item.id !== -1), newGrade, { id: -1, name: 'Create New' }];
      this.selectedGradeItem = [...(this.selectedGradeItem || []).filter(item => item.id !== -1), newGrade];
      this.addFarm.get('selectedGrade').setValue(this.selectedGradeItem);
      this.createGrade = false;
    });
  }

  // Submit new Subject
  onSubmitSubject() {
    const newSubject = { id: this.SubjectList.length + 1, name: this.addSubject.value.subjectName,type:'Subject' };
    this.farmService.createMetaData(newSubject).subscribe((response) => {
      newSubject.id = response.dataObject;
      this.SubjectList = [...this.SubjectList.filter(item => item.id !== -1), newSubject, { id: -1, name: 'Create New' }];
      this.selectedSubjectItem = [...(this.selectedSubjectItem || []).filter(item => item.id !== -1), newSubject];
      this.addFarm.get('selectedSubject').setValue(this.selectedSubjectItem);
      this.createSubject = false;
    });
  }

  // Submit new Tool
  onSubmitTool() {
    const newTool = { id: this.ToolList.length + 1, name: this.addTool.value.ToolName,type:'Tool' };
    this.farmService.createMetaData(newTool).subscribe((response) => {
      newTool.id = response.dataObject;
      this.ToolList = [...this.ToolList.filter(item => item.id !== -1), newTool, { id: -1, name: 'Create New' }];
      this.selectedToolItem = [...(this.selectedToolItem || []), newTool];
      this.weeks.at(this.selectedWeek).get('selectedTool').setValue(this.selectedToolItem);
      this.createTool = false;
    });
  }

  // onchange event for Industry
  onchangeEvent(selectedItem: { id: number; name: string }[]) {
    this.selectedIndustryItem = selectedItem;
  }

  // onchange event for Role
  onchangeRoleEvent(selectedItem: { id: number; name: string }) {
    this.selectedRoleItem = selectedItem;
  }

  // onchange event for Tool, with weekIndex for selecting the specific week
  onchangeToolEvent(selectedItem: { id: number; name: string }, weekIndex: number) {
    this.selectedToolItem = selectedItem;
    this.selectedWeek = weekIndex;
    this.weeks.at(weekIndex).get('selectedTool').setValue(selectedItem);
  }

  // onchange event for Grade
  onchangeGradeEvent(selectedItem: { Id: number; Name: string }) {
    this.selectedGradeItem = selectedItem;
  }

  // onchange event for Subject
  onchangeSubjectEvent(selectedItem: { id: number; name: string }) {
    this.selectedSubjectItem = selectedItem;
  }

  // Build the request payload for submission
  private buildRequestPayload() {
    
    return {
      ProjectId : this.id,
      projectName: this.addFarm.get('ProjectTile').value,
      projectDescription: this.addFarm.get('Description').value,
      IndustrySpecificProblem : this.addFarm.get('IndustrySpecificProblem').value,
      ProjectDuration : this.addFarm.get('ProjectDuration').value,
      industryIds: this.addFarm.get('selectedIndustry').value.map(industry => industry.id),
      gradeIds: this.addFarm.get('selectedGrade').value.map(grade => grade.id),
      roleIds: this.addFarm.get('selectedRole').value.map(role => role.id),
      subjectIds: this.addFarm.get('selectedSubject').value.map(subject => subject.id),
      ProjectImages: this.selectedImages,
      weeks: this.weeks.value.map(week => ({
        weekId : week.weekId,
        lessonPlan: week.lessonPlan,
        objectives: week.objectives,
        activities: week.activities,
        stepCaption: this.StepCation,
        tools: week.selectedTool.map(tool => tool.id)
      })),
      prerequisiteLearnings: this.addFarm.get('PrerequisiteLearnings').value,
      curriculumPoints: this.addFarm.get('CurriculumPoints').value
    };
  }

  

  
 // Tracks collapsed state of each week
  allCollapsed: boolean = true; // Tracks whether all weeks are collapsed

  // Other component properties and methods...

  // Toggle collapse for a specific week
  toggleCollapse(index: number) {
    this.isCollapsed[index] = !this.isCollapsed[index];
  }

  // Toggle collapse/expand all weeks
  toggleCollapseAll() {
    if (this.allCollapsed) {
      // Expand all weeks
      this.isCollapsed = this.isCollapsed.map(() => false);
    } else {
      // Collapse all weeks
      this.isCollapsed = this.isCollapsed.map(() => true);
    }
    this.allCollapsed = !this.allCollapsed; // Toggle the state of allCollapsed
  }
  getSelectedItemsText(items: any[]): string {
    if (!items || items.length === 0) {
      return 'No items selected'; // Default text if no items are selected
    }
    return items.map(item => item.name).join(', ');
  }
  removeSelectedItem(index: number, type: string,weekNumber:any) {
    debugger;
    if (type === 'Role') {
      this.selectedRoleItem.splice(index, 1); // Remove item from the selected industry list
      // Update the form control with the new array
      this.addFarm.get('selectedRole').setValue(this.selectedRoleItem);
    }
    if (type === 'Industry') {
      this.selectedIndustryItem.splice(index, 1); // Remove item from the selected industry list
      // Update the form control with the new array
      this.addFarm.get('selectedIndustry').setValue(this.selectedIndustryItem);
    }
    if (type === 'Grad') {
      this.selectedGradeItem.splice(index, 1); // Remove item from the selected industry list
      // Update the form control with the new array
      this.addFarm.get('selectedGrade').setValue(this.selectedGradeItem);
    }
    if (type === 'Subject') {
      this.selectedSubjectItem.splice(index, 1); // Remove item from the selected industry list
      // Update the form control with the new array
      this.addFarm.get('selectedSubject').setValue(this.selectedSubjectItem);
    }
    if(type === 'Tool')
    {
       // Get the selected tools for the specific week
      const selectedTools = this.weeks.controls[weekNumber].get('selectedTool').value;
      
      // Remove the tool from the selected tools array for the specific week
      selectedTools.splice(weekNumber, 1);
      
      // Update the form control with the modified tools array
      this.weeks.controls[weekNumber].get('selectedTool').setValue(selectedTools);
    }
    // Add more conditions for other types of selection (e.g., roles, grades, etc.) if necessary
  }
  populateForm(projectDetails: any) {
    // Patch simple values
    this.addFarm.patchValue({
      ProjectTile: projectDetails.ProjectTile,
      Description: projectDetails.Description,
      Industry: projectDetails.Industry,
      GradeLevel: projectDetails.GradeLevel,
      IndustrySpecificProblem: projectDetails.IndustrySpecificProblem,
      ProjectDuration: projectDetails.ProjectDuration,
      PrerequisiteLearnings: projectDetails.PrerequisiteLearnings,
      CurriculumPoints: projectDetails.CurriculumPoints,
      selectedIndustry: projectDetails.selectedIndustry.map(ind => ind.IndustryId),
      selectedRole: projectDetails.selectedRole.map(role => role.RoleId),
      selectedGrade: projectDetails.selectedGrade.map(grade => grade.GradeId),
      selectedSubject: projectDetails.selectedSubject.map(sub => sub.SubjectId)
    });
  
    // Clear existing weeks
    const weeksArray = this.addFarm.get('weeks') as FormArray;
    weeksArray.clear();
  
    // Populate weeks array
    projectDetails.weeks.forEach(week => {
      weeksArray.push(this.createWeek(week));
    });
  }
  
  // Helper function to create a week FormGroup
  createWeek(week: any): FormGroup {
    return this.formBuilder.group({
      WeekLesson: [week.WeekLesson, Validators.required],
      WeekId: [week.weekId, Validators.required],
      WeekObjective: [week.WeekObjective, Validators.required],
      WeekActivities: [week.WeekActivities, Validators.required],
      stepCation :[this.StepCation]
    });
  }
  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }
  alertType: string = '';
  alertMessage: string = '';
  showAlert: boolean = false;

  // Show alert when a project is created
  showProjectCreatedAlert() {
    this.alertType = 'success'; // Bootstrap success class for green alert
    this.alertMessage = 'Project created successfully!';
    this.showAlert = true;
    this.hideAlertAfterTimeout();
  }
  showProjectUpdatedAlert() {
    this.alertType = 'success'; // Bootstrap success class for green alert
    this.alertMessage = 'Project updated successfully!';
    this.showAlert = true;
    this.hideAlertAfterTimeout();
  }

  // Show alert when a project is deleted
  showProjectDeletedAlert() {
    this.alertType = 'danger'; // Bootstrap danger class for red alert
    this.alertMessage = 'Project deleted successfully!';
    this.showAlert = true;
    this.hideAlertAfterTimeout();
  }

  // Automatically hide the alert after 3 seconds
  hideAlertAfterTimeout() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

}
