// To parse this data:
//
//   import { Convert, PlacesResponse } from "./file";
//
//   const placesResponse = Convert.toPlacesResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface PlacesResponse {
    type:        string;
    query:       string[];
    features:    Feature[];
    attribution: string;
}

export interface Feature {
    id:            string;
    type:          string;
    place_type:    string[];
    relevance:     number;
    properties:    Properties;
    text_es:       string;
    place_name_es: string;
    text:          string;
    place_name:    string;
    center:        number[];
    geometry:      Geometry;
    context:       Context[];
}

export interface Context {
    id:           string;
    text_es:      string;
    text:         string;
    wikidata?:    string;
    language_es?: Language;
    language?:    Language;
    short_code?:  ShortCode;
}

export enum Language {
    Es = "es",
}

export enum ShortCode {
    MX = "mx",
    MXMex = "MX-MEX",
    MXPue = "MX-PUE",
}

export interface Geometry {
    type:        string;
    coordinates: number[];
}

export interface Properties {
    accuracy: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toPlacesResponse(json: string): PlacesResponse {
        return cast(JSON.parse(json), r("PlacesResponse"));
    }

    public static placesResponseToJson(value: PlacesResponse): string {
        return JSON.stringify(uncast(value, r("PlacesResponse")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "PlacesResponse": o([
        { json: "type", js: "type", typ: "" },
        { json: "query", js: "query", typ: a("") },
        { json: "features", js: "features", typ: a(r("Feature")) },
        { json: "attribution", js: "attribution", typ: "" },
    ], false),
    "Feature": o([
        { json: "id", js: "id", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "place_type", js: "place_type", typ: a("") },
        { json: "relevance", js: "relevance", typ: 0 },
        { json: "properties", js: "properties", typ: r("Properties") },
        { json: "text_es", js: "text_es", typ: "" },
        { json: "place_name_es", js: "place_name_es", typ: "" },
        { json: "text", js: "text", typ: "" },
        { json: "place_name", js: "place_name", typ: "" },
        { json: "center", js: "center", typ: a(3.14) },
        { json: "geometry", js: "geometry", typ: r("Geometry") },
        { json: "context", js: "context", typ: a(r("Context")) },
    ], false),
    "Context": o([
        { json: "id", js: "id", typ: "" },
        { json: "text_es", js: "text_es", typ: "" },
        { json: "text", js: "text", typ: "" },
        { json: "wikidata", js: "wikidata", typ: u(undefined, "") },
        { json: "language_es", js: "language_es", typ: u(undefined, r("Language")) },
        { json: "language", js: "language", typ: u(undefined, r("Language")) },
        { json: "short_code", js: "short_code", typ: u(undefined, r("ShortCode")) },
    ], false),
    "Geometry": o([
        { json: "type", js: "type", typ: "" },
        { json: "coordinates", js: "coordinates", typ: a(3.14) },
    ], false),
    "Properties": o([
        { json: "accuracy", js: "accuracy", typ: "" },
    ], false),
    "Language": [
        "es",
    ],
    "ShortCode": [
        "mx",
        "MX-MEX",
        "MX-PUE",
    ],
};
