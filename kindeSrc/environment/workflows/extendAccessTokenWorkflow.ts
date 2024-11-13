import { onUserTokenGeneratedEvent,version, createKindeAPI, getEnvironmentVariable, accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"
import { settings } from "../../../utils/utils.ts";
// import { User } from "@kinde/managements-api-js/workflow"

export const workflowSettings: WorkflowSettings = {
  id: "addAccessTokenClaim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  name: "Add Access Token Claim",
  bindings: {
    "kinde.accessToken": {},
    "kinde.fetch": {},
    "url": {},
    "kinde.env": {},
    "console.log": {},
  }
};

export default {
  async handle(event: onUserTokenGeneratedEvent) {
    const excludedPermissions = ['payments:create'];

    const orgCode = event.context.organization.code;
    const userId = event.context.user.id;
    
    const kindeAPI = await createKindeAPI(event);
    console.log('log api', kindeAPI)
    console.log('package version', version);
    console.log('here');

    console.log(kinde.env.get('WF_M2M_CLIENT_ID')?.value || 'NOT FOUND - ID');
    console.log(kinde.env.get('WF_M2M_CLIENT_SECRET')?.value || 'NOT FOUND - SECRET');
    
    
    const res = await kindeAPI.get(
      `organizations/${orgCode}/users/${userId}/permissions`
    );

    console.log('log api - res', res.json)
    
    const accessToken = accessTokenCustomClaims<{ hello: string; settings: string; permissions: []}>();
    accessToken.hello = "Hello there!";
    accessToken.settings = settings.output
    accessToken.permissions =  res.json.permissions.filter((p) => !excludedPermissions.includes(p.key))
  }
}
