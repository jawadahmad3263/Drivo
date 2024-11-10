const mongoose = require("mongoose");
const config = require("../../../config/config.json");

const addNew = ({ model, newObj }) => {
  return new (mongoose.model(model))(newObj).save();
};

const updateRow = ({ model, queryObj, upsertOption, updatedObj }) => {
  const upsertValue = upsertOption ? true : false;
  return mongoose
    .model(model)
    .findOneAndUpdate(queryObj, { $set: updatedObj }, { new: true, upsert: upsertValue });
};

const updateArrayInRow = ({ model, queryObj, updatedObj }) => {
  return mongoose
    .model(model)
    .findOneAndUpdate(queryObj, updatedObj, { new: true });
};

const queryRow = async ({ model, queryObj }) => {
  return mongoose.model(model).findOne(queryObj).lean();
};

const queryAll = async ({ model, queryObj }) => {
  return mongoose.model(model).find(queryObj).sort({ createdAt: -1 });
};

const querySelectedRows = ({ model, queryObj,sortByObj, offset, limit, populatedObj }) => {
  return mongoose.model(model)
    .find(queryObj)
    .sort(sortByObj)
    .populate(populatedObj)
    .skip(offset)
    .limit(limit)
    .lean();
};

const makeSpecializedQuery = ({ model, queryObj, offset, limit, populatedObj, sortByObj, selectFields }) => {
  sortByObj = sortByObj || {};
  selectFields = selectFields || '';
  offset = offset || 0;
  limit = limit || 0;
  return mongoose.model(model)
    .find(queryObj)
    .select(selectFields)
    .sort(sortByObj)
    .populate(populatedObj)
    .skip(offset)
    .limit(limit)
    .lean();
};

const makeSpecializedSingleQuery = ({ model, queryObj, populatedObj, selectFields }) => {
  return mongoose.model(model)
    .findOne(queryObj)
    .select(selectFields)
    .populate(populatedObj)
    .lean();
};

const hardDeleteRow = ({ model, queryObj }) => {
  return mongoose.model(model).deleteOne(queryObj);
};

const softDeleteRow = ({ model, queryObj }) => {
  return mongoose
    .model(model)
    .findOneAndUpdate(
      queryObj,
      { $set: { deletedAt: Date.now() } },
      { new: true }
    );
};

const getCount = async ({ model, queryObj }) => {
  try {
    const count = await mongoose
      .model(model)
      .countDocuments(queryObj);
    return count;
  } catch {
    return undefined;
  }
};

const querySpecificFields = async ({ model, queryObj, selectFields }) => {
  return mongoose.model(model).findOne(queryObj).select(selectFields.join(' ')).lean();
};

const updateMultipleRows = ({ model, queryObj, updatedObj }) => {
  return mongoose
    .model(model)
    .updateMany(queryObj, { $set: updatedObj }, { new: false })
    .lean();
};

const updateOverallRatingAndReviews = (model, queryObj, rating, isAdded) => {
  const update = isAdded
    ? { $inc: { total_reviews: 1 }, $set: { rating } }
    : { $inc: { total_reviews: -1 }, $set: { rating } };
  return mongoose.model(model).findOneAndUpdate(queryObj, update);
};

const blindUpdate = ({ model, queryObj, upsertOption, updatedObj }) => {
  const upsertValue = upsertOption ? true : false;
  return mongoose
    .model(model)
    .findOneAndUpdate(queryObj, { $set: updatedObj }, { new: false, upsert: upsertValue });
};

function getMinuteDifference(fixedTime, timeToCompare) {
  const timeDifference = timeToCompare.getTime() - fixedTime.getTime();
  const minuteDifference = Math.floor(timeDifference / 60000);
  return minuteDifference;
}
const doesRecordExist = async ({ model, queryObj }) => {
  return await mongoose.model(model).exists(queryObj) ? true : false;
};
module.exports = {
  addNew,
  updateRow,
  updateArrayInRow,
  queryRow,
  querySelectedRows,
  queryAll,
  hardDeleteRow,
  softDeleteRow,
  getCount,
  querySpecificFields,
  updateMultipleRows,
  updateOverallRatingAndReviews,
  getMinuteDifference,
  makeSpecializedQuery,
  makeSpecializedSingleQuery,
  blindUpdate,
  doesRecordExist
};
