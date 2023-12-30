import {Prisma, Roles} from "@prisma/client";
import {createRole, deleteRoleByName, findRoleByName} from "../repositories/rolesRepository";

export async function addNewRole(name: string, description: string) {
    const role: Prisma.RolesCreateInput = {
        name: name,
        description: description
    }

    return await createRole(role)
}

export async function deleteRole(name: string): Promise<Roles | null> {
    const role = await findRoleByName(name)
    if (!role) {
        return null
    }
    return await deleteRoleByName(name)
}