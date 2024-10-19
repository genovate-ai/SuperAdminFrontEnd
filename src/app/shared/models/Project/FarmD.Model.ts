import { FormGroup } from '@angular/forms';


export class FarmDModel {

    projectId: number; // Corresponds to project_id in C#
    projectName: string; // Corresponds to project_name
    projectDescription: string; // Assuming this is a string, though it's int in your C# model
    industryId: string; // Corresponds to industry_id
    gradeLevel: string; // Corresponds to grade_level
    prerequisiteLearnings: string; // Corresponds to prerequisite_learnings
    curriculumPoints: string; // Assuming this is descriptive and should be string, instead of int
    startDate: string; // Send as a string (ISO format)
    endDate: string; // Send as a string (ISO format)
    projectImages : string[]
}
