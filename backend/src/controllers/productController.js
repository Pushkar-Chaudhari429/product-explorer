import * as productService from '../services/productService.js';
import { validateProductQuery } from '../validators/productQuerySchema.js';
import { successResponse } from '../utils/responseBuilder.js';
import { AppError } from '../utils/AppError.js';

export async function getProducts(req, res, next) {
  try {
    const params = validateProductQuery(req.query);
    const { cursor, snapshotTime: clientSnapshotTime, limit, category, search } = params;
    const isFirstPage = !cursor;

    if (!isFirstPage && !clientSnapshotTime) {
      throw new AppError('snapshotTime is required when cursor is provided', 400, 'MISSING_SNAPSHOT_TIME');
    }

    const snapshotTime = isFirstPage ? await productService.getSnapshotTime() : clientSnapshotTime;

    const { products, nextCursor, hasNextPage, queryDuration } =
      await productService.getProducts({ cursor, snapshotTime, limit, category, search });

    const snapshotTimeISO = snapshotTime instanceof Date ? snapshotTime.toISOString() : snapshotTime;

    res.json(successResponse(
      { products, nextCursor, snapshotTime: snapshotTimeISO, hasNextPage },
      { pageSize: limit, returned: products.length, queryDuration },
    ));
  } catch (err) {
    next(err);
  }
}
