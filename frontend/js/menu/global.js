let currentProductId = null

export function setProductId(data) {
    currentProductId = data;
}

export function getProductId() {
    return currentProductId    
}