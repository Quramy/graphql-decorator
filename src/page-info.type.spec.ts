import 'reflect-metadata';

import * as D from './decorator';
import * as graphql from 'graphql';

import { SchemaFactoryError, SchemaFactoryErrorType, schemaFactory } from './schema_factory';

import { PageInfo } from './page-info.type';
import { execute } from 'graphql/execution';
import { parse } from 'graphql/language';
import { validate } from 'graphql/validation';

const assert = require('assert');

// const parse = require("graphql/language").parse as (source: string) => any;
// const validate = require("graphql/validation").validate as (schema: any, ast: any, ...args: any[]) => any[];
// const execute = require("graphql/execution").execute as (schema: any, ast: any, ...args: any[]) => Promise<any>;

describe('PageInfo', function () {

  it('should return correct pagination when all parameters are provided', function () {
    let pageInfo = new PageInfo(100, 0, 10);
    assert(pageInfo.hasNextPage === true);
    assert(pageInfo.hasPreviousPage === false);
  });

  it('should return correct pagination when both limit and offset are not provided', function () {
    let pageInfo = new PageInfo(100, undefined, undefined);
    assert(pageInfo.hasNextPage === false);
    assert(pageInfo.hasPreviousPage === false);
  });

  describe('limit', function () {

    it('should return correct pagination when limit is bigger than count', function () {
      let pageInfo = new PageInfo(100, 10, 200);
      assert(pageInfo.hasNextPage === false);
      assert(pageInfo.hasPreviousPage === true);
    });

    it('should return correct pagination when limit is smaller than count', function () {
      let pageInfo = new PageInfo(100, 10, 10);
      assert(pageInfo.hasNextPage === true);
      assert(pageInfo.hasPreviousPage === true);
    });

    it('should return correct pagination when limit is a negative number', function () {
      let pageInfo = new PageInfo(100, 10, -10);
      assert(pageInfo.hasNextPage === false);
      assert(pageInfo.hasPreviousPage === true);
    });

    it('should return correct pagination when limit is zero', function () {
      let pageInfo = new PageInfo(100, 10, 0);
      assert(pageInfo.hasNextPage === false);
      assert(pageInfo.hasPreviousPage === true);
    });

    it('should return correct pagination when limit is not provided', function () {
      let pageInfo = new PageInfo(100, 10, undefined);
      assert(pageInfo.hasNextPage === false);
      assert(pageInfo.hasPreviousPage === true);
    });

  });

  describe('offset', function () {

    it('should return correct pagination when offset is a bigger than count', function () {
      let pageInfo = new PageInfo(100, 200, 10);
      assert(pageInfo.hasNextPage === false);
      assert(pageInfo.hasPreviousPage === true);
    });

    it('should return correct pagination when offset is smaller than count', function () {
      let pageInfo = new PageInfo(100, 5, 10);
      assert(pageInfo.hasNextPage === true);
      assert(pageInfo.hasPreviousPage === true);
    });

    it('should return correct pagination when offset is a negative number', function () {
      let pageInfo = new PageInfo(100, -5, 10);
      assert(pageInfo.hasNextPage === true);
      assert(pageInfo.hasPreviousPage === false);
    });

    it('should return correct pagination when offset is zero', function () {
      let pageInfo = new PageInfo(100, 0, 10);
      assert(pageInfo.hasNextPage === true);
      assert(pageInfo.hasPreviousPage === false);
    });

    it('should return correct pagination when offset is not provided', function () {
      let pageInfo = new PageInfo(100, undefined, 10);
      assert(pageInfo.hasNextPage === true);
      assert(pageInfo.hasPreviousPage === false);
    });

  });

});
