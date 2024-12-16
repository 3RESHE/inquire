import { describe, it } from 'mocha';
import { expect } from 'chai';

import Create from '../src/builder/Create';
import Engine from '../src/Engine';
import Exception from '../src/Exception';

describe('Create Builder Tests', () => {
  it('Should build create', async () => {
    const create = new Create('table');
    create.addField('id', { 
      type: 'integer',
      length: 11,
      nullable: false,
      comment: 'Foobar',
      autoIncrement: true
    });
    create.addField('profileId', { 
      type: 'integer',
      length: 11,
      nullable: false,
      comment: 'Foobar',
      autoIncrement: true
    });
    create.addField('name', { 
      type: 'string',
      length: 255,
      default: 'foobar',
      nullable: true,
      comment: 'Foobar'
    });
    create.addField('price', { 
      type: 'float',
      length: [ 11, 2 ],
      default: 1.1,
      nullable: true,
      unsigned: true,
      comment: 'Foobar'
    });
    create.addField('active', { 
      type: 'boolean',
      default: 'true',
      nullable: true,
      comment: 'Foobar'
    });
    create.addField('date', { 
      type: 'datetime',
      default: 'now()',
      nullable: true,
      comment: 'Foobar'
    });
    create.addKey('price', 'name');
    create.addUniqueKey('name', 'name');
    create.addPrimaryKey('id');
    create.addForeignKey('profileId', { 
      local: 'profileId',
      foreign: 'id',
      table: 'profile',
      delete: 'CASCADE',
      update: 'RESTRICT'
    });
    const build = create.build();

    expect(build.fields.name.type).to.equal('string');
    expect(build.keys.price[0]).to.equal('name');
    expect(build.unique.name[0]).to.equal('name');
    expect(build.primary[0]).to.equal('id');
    expect(build.foreign.profileId.local).to.equal('profileId');
  });

  // Line 46 - 53
  it('Should handle setting and getting the engine', () => {
    const create = new Create('table');
    const mockEngine = {} as Engine;
    expect(create.engine).to.be.undefined;
    create.engine = mockEngine;
    expect(create.engine).to.equal(mockEngine);
    create.engine = undefined;
    expect(create.engine).to.be.undefined;
  });

  // Line 128 - 143
  it('Should throw an exception when dialect is not provided and engine is undefined', () => {
    const create = new Create('table');
    expect(() => create.query()).to.throw('No dialect provided');
  });

  // Line 128 - 143
  it('Should return a promise when query method is called with a valid engine', () => {
    const mockDialect = {
      create: () => 'mock query'
    };
    const mockEngine = {
      query: () => Promise.resolve(['result']),
      dialect: mockDialect
    } as unknown as Engine;
    const create = new Create('table', mockEngine);
    const result = create.then((res) => res);
    expect(result).to.be.a('promise');
    return result.then((res) => {
      expect(res).to.deep.equal(['result']);
    });
  });

  // Line 128 - 143
  it('Should throw an exception when no engine is provided', () => {
    const create = new Create('table', undefined as unknown as Engine);
    expect(() => create.then((res) => res)).to.throw(Exception, 'No engine provided');
  });

});