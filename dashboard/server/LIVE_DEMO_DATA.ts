import { AuthContext } from "./middleware/01-authorization";
import { ProjectModel } from "~/../shared/schema/ProjectSchema";
import { LITLYX_PROJECT_ID } from '@data/LITLYX'
import { hasAccessToProject } from "./utils/hasAccessToProject";

export async function getUserProjectFromId(project_id: string, user: AuthContext | undefined, allowGuest: boolean = true) {
    if (project_id == LITLYX_PROJECT_ID) {
        const project = await ProjectModel.findOne({ _id: project_id });
        return project;
    } else {
        if (!user?.logged) return;
        const project = await ProjectModel.findById(project_id);
        if (!project) return;
        const [hasAccess, role] = await hasAccessToProject(user.id, project_id, project);
        if (!hasAccess) return;
        if (role === 'GUEST' && !allowGuest) return false;
        return project;
    }


}