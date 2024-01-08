import {Prisma, Role} from "@prisma/client";
import {createRole, deleteRoleByName, findRoleByName} from "../repositories/roleRepository";

export async function addNewRole(name: string, description: string): Promise<Role> {
    const role: Prisma.RoleCreateInput = {
        name: name,
        description: description
    }

    return await createRole(role)
}

export async function deleteRole(name: string): Promise<Role | null> {
    const role = await findRoleByName(name)
    if (!role) {
        return null
    }
    return await deleteRoleByName(name)
}