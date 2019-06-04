const noopBatch = cb => cb()
let batch = noopBatch

export const setBatch = newBatch => (batch = newBatch)

export const getBatch = () => batch