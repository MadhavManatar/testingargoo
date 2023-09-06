


export interface LinkEntityValues {
    id: number;
    name: string;
}
export interface LinkEntityData {
    contacts: LinkEntityValues[];
    leads: LinkEntityValues[];
    accounts: LinkEntityValues[];
    deals: LinkEntityValues[];
}


export interface LinkEntityResponse {
    accounts?: LinkEntityValues;
    contacts?: LinkEntityValues;
    leads?: LinkEntityValues;
    id: number;
    model_name: string;
    model_record_id: string;
}

export type EmailLinkEntityFieldType = {
    entity?: string;
};

export interface EmailLinkEntityRequest  {
    model_name: string;
    model_record_id: number;
};