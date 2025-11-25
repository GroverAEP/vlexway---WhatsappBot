export function normalizeId(id) {
    const match = id.match(/\d+/);
    console.log(match)
    return match ? match[0] : id;        

}