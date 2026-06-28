export interface PermissionCurrentUser extends API.CurrentUser {
  permissions?: string[];
  permissionCodes?: string[];
}
