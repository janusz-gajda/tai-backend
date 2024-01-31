import {Prisma, Role} from "@prisma/client";
import {createRole, deleteRoleByName, findRoleByName, findRoles, updateRoleData} from "../repositories/roleRepository";
import {ResponseError} from "../utils/response";
import {throwIfArrayIsEmpty, throwIfObjectIsNull} from "../utils/dataChecks";

export async function getRoles() {
    const roles = await findRoles()
    throwIfArrayIsEmpty(roles)
    return roles
}

export async function getRoleByName(name: string) {
    const role = await findRoleByName(name)
    throwIfObjectIsNull(role)
    return role
}

export async function addNewRole(name: string, description: string): Promise<Role> {
    const role: Prisma.RoleCreateInput = {
        name: name,
        description: description
    }

    return await createRole(role)
}

export async function updateRole(id: string, roleData: Prisma.RoleUpdateInput) {
    if (!(await findRoleByName(id))) {
        throw new ResponseError(404, 'role not found')
    }

    await updateRoleData(id, roleData)
}

export async function deleteRole(name: string) {
    if (!(await findRoleByName(name))) {
        throw new ResponseError(404, 'role not found')
    }
    await deleteRoleByName(name)
}