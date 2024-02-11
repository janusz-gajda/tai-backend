import {Permission, Prisma} from "@prisma/client";
import {
    createPermission,
    deletePermissionByName,
    findPermissionByName,
    findPermissions,
    updatePermissionData
} from "../repositories/permissionRepository";
import {ResponseError} from "../utils/response";

export async function getPermissions() {
    return await findPermissions()
}

export async function getPermissionByName(name: string) {
    return await findPermissionByName(name)
}

export async function addNewPermission(name: string, description: string): Promise<Permission> {
    const role: Prisma.PermissionCreateInput = {
        name: name,
        description: description
    }
    return await createPermission(role)
}

export async function updatePermission(id: string, roleData: Prisma.PermissionUpdateInput) {
    if (!(await findPermissionByName(id))) {
        throw new ResponseError(404, 'role not found')
    }
    await updatePermissionData(id, roleData)
}

export async function deletePermission(name: string) {
    if (!(await findPermissionByName(name))) {
        throw new ResponseError(404, 'role not found')
    }
    await deletePermissionByName(name)
}

export function checkIfUserHasPermission(userPermissions: Permission[], ...permissionsToCheck: string[]) {
    if (userPermissions.length == 0) {
        throw new ResponseError(403, 'user has no permissions')
    }
    let valid: boolean = false
    const userPermissionNames: string[] = userPermissions.map((p: Permission) => p.name)

    permissionsToCheck.forEach((permission: string) => {
        if (userPermissionNames.includes(permission)) {
            valid = true
            return
        }
    })
    if (!valid) {
        throw new ResponseError(403, 'user not allowed to execute this operation')
    }
}
