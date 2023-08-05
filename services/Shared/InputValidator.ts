
export class MissingField extends Error {

}

export function validateAsSpotTable(obj: any) {
    if (!obj.spotId) {
        throw new MissingField("spotId is missing");
    }
}