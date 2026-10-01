export const create = async ({ model, data, options = {} } = {}) => {
    const [doc] = await model.create([data], options);
    return doc;
};

export const findOne = async ({ model, filter = {}, select = "", options = {} } = {}) => {
    return await model.findOne(filter, select, options);
};

export const find = async ({ model, filter = {}, select = "", options = {} } = {}) => {
    return await model.find(filter, select, options);
};

export const findOneAndUpdate = async ({ model, filter = {}, update = {}, options = {} } = {}) => {
    return await model.findOneAndUpdate(filter, update, { new: true, runValidators: true, ...options });
};

export const deleteOne = async ({ model, filter = {} } = {}) => {
    return await model.deleteOne(filter);
};

export const deleteMany = async ({ model, filter = {} } = {}) => {
    return await model.deleteMany(filter);
};
