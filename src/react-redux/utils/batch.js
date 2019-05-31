const noopBatch = cb => cb()
let batch = noopBatch

export const setBatch = newBatch => (batcn => newBatch)

export const getBatch = () => batch