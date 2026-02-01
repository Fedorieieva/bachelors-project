/**
 * Client
 **/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Session
 *
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>;
/**
 * Model Riddles
 *
 */
export type Riddles = $Result.DefaultSelection<Prisma.$RiddlesPayload>;
/**
 * Model Comment
 *
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>;
/**
 * Model Like
 *
 */
export type Like = $Result.DefaultSelection<Prisma.$LikePayload>;
/**
 * Model AIPrompt
 *
 */
export type AIPrompt = $Result.DefaultSelection<Prisma.$AIPromptPayload>;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Sessions
   * const sessions = await prisma.session.findMany()
   * ```
   */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.riddles`: Exposes CRUD operations for the **Riddles** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Riddles
   * const riddles = await prisma.riddles.findMany()
   * ```
   */
  get riddles(): Prisma.RiddlesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Comments
   * const comments = await prisma.comment.findMany()
   * ```
   */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.like`: Exposes CRUD operations for the **Like** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Likes
   * const likes = await prisma.like.findMany()
   * ```
   */
  get like(): Prisma.LikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aIPrompt`: Exposes CRUD operations for the **AIPrompt** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AIPrompts
   * const aIPrompts = await prisma.aIPrompt.findMany()
   * ```
   */
  get aIPrompt(): Prisma.AIPromptDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 7.1.0
   * Query Engine version: ab635e6b9d606fa5c8fb8b1a7f909c3c3c1c98ba
   */
  export type PrismaVersion = {
    client: string;
    engine: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
    ReturnType<T>
  >;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
    IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
    T,
    MaybeTupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    User: 'User';
    Session: 'Session';
    Riddles: 'Riddles';
    Comment: 'Comment';
    Like: 'Like';
    AIPrompt: 'AIPrompt';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps: 'user' | 'session' | 'riddles' | 'comment' | 'like' | 'aIPrompt';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>;
        fields: Prisma.SessionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSession>;
          };
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<SessionGroupByOutputType>[];
          };
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>;
            result: $Utils.Optional<SessionCountAggregateOutputType> | number;
          };
        };
      };
      Riddles: {
        payload: Prisma.$RiddlesPayload<ExtArgs>;
        fields: Prisma.RiddlesFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.RiddlesFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.RiddlesFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>;
          };
          findFirst: {
            args: Prisma.RiddlesFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.RiddlesFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>;
          };
          findMany: {
            args: Prisma.RiddlesFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>[];
          };
          create: {
            args: Prisma.RiddlesCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>;
          };
          createMany: {
            args: Prisma.RiddlesCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.RiddlesCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>[];
          };
          delete: {
            args: Prisma.RiddlesDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>;
          };
          update: {
            args: Prisma.RiddlesUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>;
          };
          deleteMany: {
            args: Prisma.RiddlesDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.RiddlesUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.RiddlesUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>[];
          };
          upsert: {
            args: Prisma.RiddlesUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RiddlesPayload>;
          };
          aggregate: {
            args: Prisma.RiddlesAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateRiddles>;
          };
          groupBy: {
            args: Prisma.RiddlesGroupByArgs<ExtArgs>;
            result: $Utils.Optional<RiddlesGroupByOutputType>[];
          };
          count: {
            args: Prisma.RiddlesCountArgs<ExtArgs>;
            result: $Utils.Optional<RiddlesCountAggregateOutputType> | number;
          };
        };
      };
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>;
        fields: Prisma.CommentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[];
          };
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[];
          };
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[];
          };
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateComment>;
          };
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CommentGroupByOutputType>[];
          };
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>;
            result: $Utils.Optional<CommentCountAggregateOutputType> | number;
          };
        };
      };
      Like: {
        payload: Prisma.$LikePayload<ExtArgs>;
        fields: Prisma.LikeFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.LikeFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.LikeFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          findFirst: {
            args: Prisma.LikeFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.LikeFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          findMany: {
            args: Prisma.LikeFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[];
          };
          create: {
            args: Prisma.LikeCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          createMany: {
            args: Prisma.LikeCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.LikeCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[];
          };
          delete: {
            args: Prisma.LikeDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          update: {
            args: Prisma.LikeUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          deleteMany: {
            args: Prisma.LikeDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.LikeUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.LikeUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[];
          };
          upsert: {
            args: Prisma.LikeUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          aggregate: {
            args: Prisma.LikeAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateLike>;
          };
          groupBy: {
            args: Prisma.LikeGroupByArgs<ExtArgs>;
            result: $Utils.Optional<LikeGroupByOutputType>[];
          };
          count: {
            args: Prisma.LikeCountArgs<ExtArgs>;
            result: $Utils.Optional<LikeCountAggregateOutputType> | number;
          };
        };
      };
      AIPrompt: {
        payload: Prisma.$AIPromptPayload<ExtArgs>;
        fields: Prisma.AIPromptFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AIPromptFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AIPromptFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>;
          };
          findFirst: {
            args: Prisma.AIPromptFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AIPromptFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>;
          };
          findMany: {
            args: Prisma.AIPromptFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>[];
          };
          create: {
            args: Prisma.AIPromptCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>;
          };
          createMany: {
            args: Prisma.AIPromptCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AIPromptCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>[];
          };
          delete: {
            args: Prisma.AIPromptDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>;
          };
          update: {
            args: Prisma.AIPromptUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>;
          };
          deleteMany: {
            args: Prisma.AIPromptDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AIPromptUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AIPromptUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>[];
          };
          upsert: {
            args: Prisma.AIPromptUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AIPromptPayload>;
          };
          aggregate: {
            args: Prisma.AIPromptAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAIPrompt>;
          };
          groupBy: {
            args: Prisma.AIPromptGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AIPromptGroupByOutputType>[];
          };
          count: {
            args: Prisma.AIPromptCountArgs<ExtArgs>;
            result: $Utils.Optional<AIPromptCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory;
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
  }
  export type GlobalOmitConfig = {
    user?: UserOmit;
    session?: SessionOmit;
    riddles?: RiddlesOmit;
    comment?: CommentOmit;
    like?: LikeOmit;
    aIPrompt?: AIPromptOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number;
    riddles: number;
    comments: number;
    likes: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
    riddles?: boolean | UserCountOutputTypeCountRiddlesArgs;
    comments?: boolean | UserCountOutputTypeCountCommentsArgs;
    likes?: boolean | UserCountOutputTypeCountLikesArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SessionWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRiddlesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RiddlesWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CommentWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLikesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: LikeWhereInput;
  };

  /**
   * Count Type RiddlesCountOutputType
   */

  export type RiddlesCountOutputType = {
    comments: number;
    likes: number;
  };

  export type RiddlesCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    comments?: boolean | RiddlesCountOutputTypeCountCommentsArgs;
    likes?: boolean | RiddlesCountOutputTypeCountLikesArgs;
  };

  // Custom InputTypes
  /**
   * RiddlesCountOutputType without action
   */
  export type RiddlesCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RiddlesCountOutputType
     */
    select?: RiddlesCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * RiddlesCountOutputType without action
   */
  export type RiddlesCountOutputTypeCountCommentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CommentWhereInput;
  };

  /**
   * RiddlesCountOutputType without action
   */
  export type RiddlesCountOutputTypeCountLikesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: LikeWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    name: string | null;
    onboarding_completed: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    password: string | null;
    name: string | null;
    onboarding_completed: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    password: number;
    name: number;
    onboarding_completed: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    onboarding_completed?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    onboarding_completed?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    password?: true;
    name?: true;
    onboarding_completed?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: UserWhereInput;
      orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
      by: UserScalarFieldEnum[] | UserScalarFieldEnum;
      having?: UserScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: UserCountAggregateInputType | true;
      _min?: UserMinAggregateInputType;
      _max?: UserMaxAggregateInputType;
    };

  export type UserGroupByOutputType = {
    id: string;
    email: string;
    password: string;
    name: string | null;
    onboarding_completed: boolean | null;
    created_at: Date;
    updated_at: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        email?: boolean;
        password?: boolean;
        name?: boolean;
        onboarding_completed?: boolean;
        created_at?: boolean;
        updated_at?: boolean;
        sessions?: boolean | User$sessionsArgs<ExtArgs>;
        riddles?: boolean | User$riddlesArgs<ExtArgs>;
        comments?: boolean | User$commentsArgs<ExtArgs>;
        likes?: boolean | User$likesArgs<ExtArgs>;
        _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['user']
    >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      name?: boolean;
      onboarding_completed?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      password?: boolean;
      name?: boolean;
      onboarding_completed?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    password?: boolean;
    name?: boolean;
    onboarding_completed?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'email' | 'password' | 'name' | 'onboarding_completed' | 'created_at' | 'updated_at',
      ExtArgs['result']['user']
    >;
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>;
    riddles?: boolean | User$riddlesArgs<ExtArgs>;
    comments?: boolean | User$commentsArgs<ExtArgs>;
    likes?: boolean | User$likesArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'User';
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[];
      riddles: Prisma.$RiddlesPayload<ExtArgs>[];
      comments: Prisma.$CommentPayload<ExtArgs>[];
      likes: Prisma.$LikePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        password: string;
        name: string | null;
        onboarding_completed: boolean | null;
        created_at: Date;
        updated_at: Date;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
    Prisma.$UserPayload,
    S
  >;

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    UserFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User']; meta: { name: 'User' } };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sessionsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    riddles<T extends User$riddlesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$riddlesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    comments<T extends User$commentsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$commentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    likes<T extends User$likesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$likesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly email: FieldRef<'User', 'String'>;
    readonly password: FieldRef<'User', 'String'>;
    readonly name: FieldRef<'User', 'String'>;
    readonly onboarding_completed: FieldRef<'User', 'Boolean'>;
    readonly created_at: FieldRef<'User', 'DateTime'>;
    readonly updated_at: FieldRef<'User', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which Users to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User.sessions
   */
  export type User$sessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    where?: SessionWhereInput;
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * User.riddles
   */
  export type User$riddlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Riddles
       */
      select?: RiddlesSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Riddles
       */
      omit?: RiddlesOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: RiddlesInclude<ExtArgs> | null;
      where?: RiddlesWhereInput;
      orderBy?: RiddlesOrderByWithRelationInput | RiddlesOrderByWithRelationInput[];
      cursor?: RiddlesWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: RiddlesScalarFieldEnum | RiddlesScalarFieldEnum[];
    };

  /**
   * User.comments
   */
  export type User$commentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    where?: CommentWhereInput;
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[];
    cursor?: CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * User.likes
   */
  export type User$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    where?: LikeWhereInput;
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    cursor?: LikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
    };

  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };

  export type SessionMinAggregateOutputType = {
    id: string | null;
    token: string | null;
    refresh_token: string | null;
    created_at: Date | null;
    last_activity_at: Date | null;
    expires_at: Date | null;
    userId: string | null;
  };

  export type SessionMaxAggregateOutputType = {
    id: string | null;
    token: string | null;
    refresh_token: string | null;
    created_at: Date | null;
    last_activity_at: Date | null;
    expires_at: Date | null;
    userId: string | null;
  };

  export type SessionCountAggregateOutputType = {
    id: number;
    token: number;
    refresh_token: number;
    created_at: number;
    last_activity_at: number;
    expires_at: number;
    userId: number;
    _all: number;
  };

  export type SessionMinAggregateInputType = {
    id?: true;
    token?: true;
    refresh_token?: true;
    created_at?: true;
    last_activity_at?: true;
    expires_at?: true;
    userId?: true;
  };

  export type SessionMaxAggregateInputType = {
    id?: true;
    token?: true;
    refresh_token?: true;
    created_at?: true;
    last_activity_at?: true;
    expires_at?: true;
    userId?: true;
  };

  export type SessionCountAggregateInputType = {
    id?: true;
    token?: true;
    refresh_token?: true;
    created_at?: true;
    last_activity_at?: true;
    expires_at?: true;
    userId?: true;
    _all?: true;
  };

  export type SessionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Sessions
     **/
    _count?: true | SessionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SessionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SessionMaxAggregateInputType;
  };

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
    [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>;
  };

  export type SessionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SessionWhereInput;
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[];
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum;
    having?: SessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SessionCountAggregateInputType | true;
    _min?: SessionMinAggregateInputType;
    _max?: SessionMaxAggregateInputType;
  };

  export type SessionGroupByOutputType = {
    id: string;
    token: string;
    refresh_token: string | null;
    created_at: Date;
    last_activity_at: Date | null;
    expires_at: Date;
    userId: string;
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof SessionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
          : GetScalarType<T[P], SessionGroupByOutputType[P]>;
      }
    >
  >;

  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        token?: boolean;
        refresh_token?: boolean;
        created_at?: boolean;
        last_activity_at?: boolean;
        expires_at?: boolean;
        userId?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['session']
    >;

  export type SessionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      token?: boolean;
      refresh_token?: boolean;
      created_at?: boolean;
      last_activity_at?: boolean;
      expires_at?: boolean;
      userId?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['session']
  >;

  export type SessionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      token?: boolean;
      refresh_token?: boolean;
      created_at?: boolean;
      last_activity_at?: boolean;
      expires_at?: boolean;
      userId?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['session']
  >;

  export type SessionSelectScalar = {
    id?: boolean;
    token?: boolean;
    refresh_token?: boolean;
    created_at?: boolean;
    last_activity_at?: boolean;
    expires_at?: boolean;
    userId?: boolean;
  };

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'token'
      | 'refresh_token'
      | 'created_at'
      | 'last_activity_at'
      | 'expires_at'
      | 'userId',
      ExtArgs['result']['session']
    >;
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type SessionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type SessionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Session';
      objects: {
        user: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          token: string;
          refresh_token: string | null;
          created_at: Date;
          last_activity_at: Date | null;
          expires_at: Date;
          userId: string;
        },
        ExtArgs['result']['session']
      >;
      composites: {};
    };

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> =
    $Result.GetResult<Prisma.$SessionPayload, S>;

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    SessionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: SessionCountAggregateInputType | true;
  };

  export interface SessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session']; meta: { name: 'Session' } };
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(
      args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(
      args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     *
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SessionFindManyArgs>(
      args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     *
     */
    create<T extends SessionCreateArgs>(
      args: SelectSubset<T, SessionCreateArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SessionCreateManyArgs>(
      args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     *
     */
    delete<T extends SessionDeleteArgs>(
      args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SessionUpdateArgs>(
      args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SessionDeleteManyArgs>(
      args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SessionUpdateManyArgs>(
      args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(
      args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>,
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
     **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SessionAggregateArgs>(
      args: Subset<T, SessionAggregateArgs>,
    ): Prisma.PrismaPromise<GetSessionAggregateType<T>>;

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Session model
     */
    readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<'Session', 'String'>;
    readonly token: FieldRef<'Session', 'String'>;
    readonly refresh_token: FieldRef<'Session', 'String'>;
    readonly created_at: FieldRef<'Session', 'DateTime'>;
    readonly last_activity_at: FieldRef<'Session', 'DateTime'>;
    readonly expires_at: FieldRef<'Session', 'DateTime'>;
    readonly userId: FieldRef<'Session', 'String'>;
  }

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session create
   */
  export type SessionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
  };

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Session update
   */
  export type SessionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput;
    /**
     * Limit how many Sessions to update.
     */
    limit?: number;
  };

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput;
    /**
     * Limit how many Sessions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput;
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
  };

  /**
   * Session delete
   */
  export type SessionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput;
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number;
  };

  /**
   * Session without action
   */
  export type SessionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
  };

  /**
   * Model Riddles
   */

  export type AggregateRiddles = {
    _count: RiddlesCountAggregateOutputType | null;
    _avg: RiddlesAvgAggregateOutputType | null;
    _sum: RiddlesSumAggregateOutputType | null;
    _min: RiddlesMinAggregateOutputType | null;
    _max: RiddlesMaxAggregateOutputType | null;
  };

  export type RiddlesAvgAggregateOutputType = {
    likes_count: number | null;
    comments_count: number | null;
  };

  export type RiddlesSumAggregateOutputType = {
    likes_count: number | null;
    comments_count: number | null;
  };

  export type RiddlesMinAggregateOutputType = {
    id: string | null;
    content: string | null;
    answer: string | null;
    is_public: boolean | null;
    is_verified: boolean | null;
    likes_count: number | null;
    comments_count: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    author_id: string | null;
  };

  export type RiddlesMaxAggregateOutputType = {
    id: string | null;
    content: string | null;
    answer: string | null;
    is_public: boolean | null;
    is_verified: boolean | null;
    likes_count: number | null;
    comments_count: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    author_id: string | null;
  };

  export type RiddlesCountAggregateOutputType = {
    id: number;
    content: number;
    answer: number;
    prompt_context: number;
    is_public: number;
    is_verified: number;
    likes_count: number;
    comments_count: number;
    created_at: number;
    updated_at: number;
    author_id: number;
    _all: number;
  };

  export type RiddlesAvgAggregateInputType = {
    likes_count?: true;
    comments_count?: true;
  };

  export type RiddlesSumAggregateInputType = {
    likes_count?: true;
    comments_count?: true;
  };

  export type RiddlesMinAggregateInputType = {
    id?: true;
    content?: true;
    answer?: true;
    is_public?: true;
    is_verified?: true;
    likes_count?: true;
    comments_count?: true;
    created_at?: true;
    updated_at?: true;
    author_id?: true;
  };

  export type RiddlesMaxAggregateInputType = {
    id?: true;
    content?: true;
    answer?: true;
    is_public?: true;
    is_verified?: true;
    likes_count?: true;
    comments_count?: true;
    created_at?: true;
    updated_at?: true;
    author_id?: true;
  };

  export type RiddlesCountAggregateInputType = {
    id?: true;
    content?: true;
    answer?: true;
    prompt_context?: true;
    is_public?: true;
    is_verified?: true;
    likes_count?: true;
    comments_count?: true;
    created_at?: true;
    updated_at?: true;
    author_id?: true;
    _all?: true;
  };

  export type RiddlesAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Riddles to aggregate.
     */
    where?: RiddlesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Riddles to fetch.
     */
    orderBy?: RiddlesOrderByWithRelationInput | RiddlesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: RiddlesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Riddles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Riddles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Riddles
     **/
    _count?: true | RiddlesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: RiddlesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: RiddlesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: RiddlesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: RiddlesMaxAggregateInputType;
  };

  export type GetRiddlesAggregateType<T extends RiddlesAggregateArgs> = {
    [P in keyof T & keyof AggregateRiddles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRiddles[P]>
      : GetScalarType<T[P], AggregateRiddles[P]>;
  };

  export type RiddlesGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RiddlesWhereInput;
    orderBy?: RiddlesOrderByWithAggregationInput | RiddlesOrderByWithAggregationInput[];
    by: RiddlesScalarFieldEnum[] | RiddlesScalarFieldEnum;
    having?: RiddlesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RiddlesCountAggregateInputType | true;
    _avg?: RiddlesAvgAggregateInputType;
    _sum?: RiddlesSumAggregateInputType;
    _min?: RiddlesMinAggregateInputType;
    _max?: RiddlesMaxAggregateInputType;
  };

  export type RiddlesGroupByOutputType = {
    id: string;
    content: string;
    answer: string;
    prompt_context: JsonValue | null;
    is_public: boolean;
    is_verified: boolean;
    likes_count: number;
    comments_count: number;
    created_at: Date;
    updated_at: Date;
    author_id: string;
    _count: RiddlesCountAggregateOutputType | null;
    _avg: RiddlesAvgAggregateOutputType | null;
    _sum: RiddlesSumAggregateOutputType | null;
    _min: RiddlesMinAggregateOutputType | null;
    _max: RiddlesMaxAggregateOutputType | null;
  };

  type GetRiddlesGroupByPayload<T extends RiddlesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RiddlesGroupByOutputType, T['by']> & {
        [P in keyof T & keyof RiddlesGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], RiddlesGroupByOutputType[P]>
          : GetScalarType<T[P], RiddlesGroupByOutputType[P]>;
      }
    >
  >;

  export type RiddlesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        content?: boolean;
        answer?: boolean;
        prompt_context?: boolean;
        is_public?: boolean;
        is_verified?: boolean;
        likes_count?: boolean;
        comments_count?: boolean;
        created_at?: boolean;
        updated_at?: boolean;
        author_id?: boolean;
        author?: boolean | UserDefaultArgs<ExtArgs>;
        comments?: boolean | Riddles$commentsArgs<ExtArgs>;
        likes?: boolean | Riddles$likesArgs<ExtArgs>;
        _count?: boolean | RiddlesCountOutputTypeDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['riddles']
    >;

  export type RiddlesSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      answer?: boolean;
      prompt_context?: boolean;
      is_public?: boolean;
      is_verified?: boolean;
      likes_count?: boolean;
      comments_count?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      author_id?: boolean;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['riddles']
  >;

  export type RiddlesSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      answer?: boolean;
      prompt_context?: boolean;
      is_public?: boolean;
      is_verified?: boolean;
      likes_count?: boolean;
      comments_count?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      author_id?: boolean;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['riddles']
  >;

  export type RiddlesSelectScalar = {
    id?: boolean;
    content?: boolean;
    answer?: boolean;
    prompt_context?: boolean;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: boolean;
    comments_count?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    author_id?: boolean;
  };

  export type RiddlesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      | 'id'
      | 'content'
      | 'answer'
      | 'prompt_context'
      | 'is_public'
      | 'is_verified'
      | 'likes_count'
      | 'comments_count'
      | 'created_at'
      | 'updated_at'
      | 'author_id',
      ExtArgs['result']['riddles']
    >;
  export type RiddlesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>;
    comments?: boolean | Riddles$commentsArgs<ExtArgs>;
    likes?: boolean | Riddles$likesArgs<ExtArgs>;
    _count?: boolean | RiddlesCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type RiddlesIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type RiddlesIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $RiddlesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Riddles';
      objects: {
        author: Prisma.$UserPayload<ExtArgs>;
        comments: Prisma.$CommentPayload<ExtArgs>[];
        likes: Prisma.$LikePayload<ExtArgs>[];
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          content: string;
          answer: string;
          prompt_context: Prisma.JsonValue | null;
          is_public: boolean;
          is_verified: boolean;
          likes_count: number;
          comments_count: number;
          created_at: Date;
          updated_at: Date;
          author_id: string;
        },
        ExtArgs['result']['riddles']
      >;
      composites: {};
    };

  type RiddlesGetPayload<S extends boolean | null | undefined | RiddlesDefaultArgs> =
    $Result.GetResult<Prisma.$RiddlesPayload, S>;

  type RiddlesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    RiddlesFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: RiddlesCountAggregateInputType | true;
  };

  export interface RiddlesDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Riddles']; meta: { name: 'Riddles' } };
    /**
     * Find zero or one Riddles that matches the filter.
     * @param {RiddlesFindUniqueArgs} args - Arguments to find a Riddles
     * @example
     * // Get one Riddles
     * const riddles = await prisma.riddles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RiddlesFindUniqueArgs>(
      args: SelectSubset<T, RiddlesFindUniqueArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Riddles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RiddlesFindUniqueOrThrowArgs} args - Arguments to find a Riddles
     * @example
     * // Get one Riddles
     * const riddles = await prisma.riddles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RiddlesFindUniqueOrThrowArgs>(
      args: SelectSubset<T, RiddlesFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Riddles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiddlesFindFirstArgs} args - Arguments to find a Riddles
     * @example
     * // Get one Riddles
     * const riddles = await prisma.riddles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RiddlesFindFirstArgs>(
      args?: SelectSubset<T, RiddlesFindFirstArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Riddles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiddlesFindFirstOrThrowArgs} args - Arguments to find a Riddles
     * @example
     * // Get one Riddles
     * const riddles = await prisma.riddles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RiddlesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RiddlesFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Riddles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiddlesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Riddles
     * const riddles = await prisma.riddles.findMany()
     *
     * // Get first 10 Riddles
     * const riddles = await prisma.riddles.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const riddlesWithIdOnly = await prisma.riddles.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RiddlesFindManyArgs>(
      args?: SelectSubset<T, RiddlesFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Riddles.
     * @param {RiddlesCreateArgs} args - Arguments to create a Riddles.
     * @example
     * // Create one Riddles
     * const Riddles = await prisma.riddles.create({
     *   data: {
     *     // ... data to create a Riddles
     *   }
     * })
     *
     */
    create<T extends RiddlesCreateArgs>(
      args: SelectSubset<T, RiddlesCreateArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Riddles.
     * @param {RiddlesCreateManyArgs} args - Arguments to create many Riddles.
     * @example
     * // Create many Riddles
     * const riddles = await prisma.riddles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RiddlesCreateManyArgs>(
      args?: SelectSubset<T, RiddlesCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Riddles and returns the data saved in the database.
     * @param {RiddlesCreateManyAndReturnArgs} args - Arguments to create many Riddles.
     * @example
     * // Create many Riddles
     * const riddles = await prisma.riddles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Riddles and only return the `id`
     * const riddlesWithIdOnly = await prisma.riddles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RiddlesCreateManyAndReturnArgs>(
      args?: SelectSubset<T, RiddlesCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RiddlesPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Riddles.
     * @param {RiddlesDeleteArgs} args - Arguments to delete one Riddles.
     * @example
     * // Delete one Riddles
     * const Riddles = await prisma.riddles.delete({
     *   where: {
     *     // ... filter to delete one Riddles
     *   }
     * })
     *
     */
    delete<T extends RiddlesDeleteArgs>(
      args: SelectSubset<T, RiddlesDeleteArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Riddles.
     * @param {RiddlesUpdateArgs} args - Arguments to update one Riddles.
     * @example
     * // Update one Riddles
     * const riddles = await prisma.riddles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RiddlesUpdateArgs>(
      args: SelectSubset<T, RiddlesUpdateArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Riddles.
     * @param {RiddlesDeleteManyArgs} args - Arguments to filter Riddles to delete.
     * @example
     * // Delete a few Riddles
     * const { count } = await prisma.riddles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RiddlesDeleteManyArgs>(
      args?: SelectSubset<T, RiddlesDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Riddles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiddlesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Riddles
     * const riddles = await prisma.riddles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RiddlesUpdateManyArgs>(
      args: SelectSubset<T, RiddlesUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Riddles and returns the data updated in the database.
     * @param {RiddlesUpdateManyAndReturnArgs} args - Arguments to update many Riddles.
     * @example
     * // Update many Riddles
     * const riddles = await prisma.riddles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Riddles and only return the `id`
     * const riddlesWithIdOnly = await prisma.riddles.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends RiddlesUpdateManyAndReturnArgs>(
      args: SelectSubset<T, RiddlesUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RiddlesPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Riddles.
     * @param {RiddlesUpsertArgs} args - Arguments to update or create a Riddles.
     * @example
     * // Update or create a Riddles
     * const riddles = await prisma.riddles.upsert({
     *   create: {
     *     // ... data to create a Riddles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Riddles we want to update
     *   }
     * })
     */
    upsert<T extends RiddlesUpsertArgs>(
      args: SelectSubset<T, RiddlesUpsertArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      $Result.GetResult<Prisma.$RiddlesPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Riddles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiddlesCountArgs} args - Arguments to filter Riddles to count.
     * @example
     * // Count the number of Riddles
     * const count = await prisma.riddles.count({
     *   where: {
     *     // ... the filter for the Riddles we want to count
     *   }
     * })
     **/
    count<T extends RiddlesCountArgs>(
      args?: Subset<T, RiddlesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RiddlesCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Riddles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiddlesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends RiddlesAggregateArgs>(
      args: Subset<T, RiddlesAggregateArgs>,
    ): Prisma.PrismaPromise<GetRiddlesAggregateType<T>>;

    /**
     * Group by Riddles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiddlesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends RiddlesGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RiddlesGroupByArgs['orderBy'] }
        : { orderBy?: RiddlesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, RiddlesGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetRiddlesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Riddles model
     */
    readonly fields: RiddlesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Riddles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RiddlesClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    author<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    comments<T extends Riddles$commentsArgs<ExtArgs> = {}>(
      args?: Subset<T, Riddles$commentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    likes<T extends Riddles$likesArgs<ExtArgs> = {}>(
      args?: Subset<T, Riddles$likesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Riddles model
   */
  interface RiddlesFieldRefs {
    readonly id: FieldRef<'Riddles', 'String'>;
    readonly content: FieldRef<'Riddles', 'String'>;
    readonly answer: FieldRef<'Riddles', 'String'>;
    readonly prompt_context: FieldRef<'Riddles', 'Json'>;
    readonly is_public: FieldRef<'Riddles', 'Boolean'>;
    readonly is_verified: FieldRef<'Riddles', 'Boolean'>;
    readonly likes_count: FieldRef<'Riddles', 'Int'>;
    readonly comments_count: FieldRef<'Riddles', 'Int'>;
    readonly created_at: FieldRef<'Riddles', 'DateTime'>;
    readonly updated_at: FieldRef<'Riddles', 'DateTime'>;
    readonly author_id: FieldRef<'Riddles', 'String'>;
  }

  // Custom InputTypes
  /**
   * Riddles findUnique
   */
  export type RiddlesFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * Filter, which Riddles to fetch.
     */
    where: RiddlesWhereUniqueInput;
  };

  /**
   * Riddles findUniqueOrThrow
   */
  export type RiddlesFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * Filter, which Riddles to fetch.
     */
    where: RiddlesWhereUniqueInput;
  };

  /**
   * Riddles findFirst
   */
  export type RiddlesFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * Filter, which Riddles to fetch.
     */
    where?: RiddlesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Riddles to fetch.
     */
    orderBy?: RiddlesOrderByWithRelationInput | RiddlesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Riddles.
     */
    cursor?: RiddlesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Riddles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Riddles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Riddles.
     */
    distinct?: RiddlesScalarFieldEnum | RiddlesScalarFieldEnum[];
  };

  /**
   * Riddles findFirstOrThrow
   */
  export type RiddlesFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * Filter, which Riddles to fetch.
     */
    where?: RiddlesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Riddles to fetch.
     */
    orderBy?: RiddlesOrderByWithRelationInput | RiddlesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Riddles.
     */
    cursor?: RiddlesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Riddles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Riddles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Riddles.
     */
    distinct?: RiddlesScalarFieldEnum | RiddlesScalarFieldEnum[];
  };

  /**
   * Riddles findMany
   */
  export type RiddlesFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * Filter, which Riddles to fetch.
     */
    where?: RiddlesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Riddles to fetch.
     */
    orderBy?: RiddlesOrderByWithRelationInput | RiddlesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Riddles.
     */
    cursor?: RiddlesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Riddles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Riddles.
     */
    skip?: number;
    distinct?: RiddlesScalarFieldEnum | RiddlesScalarFieldEnum[];
  };

  /**
   * Riddles create
   */
  export type RiddlesCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * The data needed to create a Riddles.
     */
    data: XOR<RiddlesCreateInput, RiddlesUncheckedCreateInput>;
  };

  /**
   * Riddles createMany
   */
  export type RiddlesCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Riddles.
     */
    data: RiddlesCreateManyInput | RiddlesCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Riddles createManyAndReturn
   */
  export type RiddlesCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * The data used to create many Riddles.
     */
    data: RiddlesCreateManyInput | RiddlesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Riddles update
   */
  export type RiddlesUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * The data needed to update a Riddles.
     */
    data: XOR<RiddlesUpdateInput, RiddlesUncheckedUpdateInput>;
    /**
     * Choose, which Riddles to update.
     */
    where: RiddlesWhereUniqueInput;
  };

  /**
   * Riddles updateMany
   */
  export type RiddlesUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Riddles.
     */
    data: XOR<RiddlesUpdateManyMutationInput, RiddlesUncheckedUpdateManyInput>;
    /**
     * Filter which Riddles to update
     */
    where?: RiddlesWhereInput;
    /**
     * Limit how many Riddles to update.
     */
    limit?: number;
  };

  /**
   * Riddles updateManyAndReturn
   */
  export type RiddlesUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * The data used to update Riddles.
     */
    data: XOR<RiddlesUpdateManyMutationInput, RiddlesUncheckedUpdateManyInput>;
    /**
     * Filter which Riddles to update
     */
    where?: RiddlesWhereInput;
    /**
     * Limit how many Riddles to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Riddles upsert
   */
  export type RiddlesUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * The filter to search for the Riddles to update in case it exists.
     */
    where: RiddlesWhereUniqueInput;
    /**
     * In case the Riddles found by the `where` argument doesn't exist, create a new Riddles with this data.
     */
    create: XOR<RiddlesCreateInput, RiddlesUncheckedCreateInput>;
    /**
     * In case the Riddles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RiddlesUpdateInput, RiddlesUncheckedUpdateInput>;
  };

  /**
   * Riddles delete
   */
  export type RiddlesDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
    /**
     * Filter which Riddles to delete.
     */
    where: RiddlesWhereUniqueInput;
  };

  /**
   * Riddles deleteMany
   */
  export type RiddlesDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Riddles to delete
     */
    where?: RiddlesWhereInput;
    /**
     * Limit how many Riddles to delete.
     */
    limit?: number;
  };

  /**
   * Riddles.comments
   */
  export type Riddles$commentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    where?: CommentWhereInput;
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[];
    cursor?: CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Riddles.likes
   */
  export type Riddles$likesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    where?: LikeWhereInput;
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    cursor?: LikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Riddles without action
   */
  export type RiddlesDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Riddles
     */
    select?: RiddlesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Riddles
     */
    omit?: RiddlesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RiddlesInclude<ExtArgs> | null;
  };

  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
  };

  export type CommentMinAggregateOutputType = {
    id: string | null;
    content: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: string | null;
    riddle_id: string | null;
  };

  export type CommentMaxAggregateOutputType = {
    id: string | null;
    content: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    user_id: string | null;
    riddle_id: string | null;
  };

  export type CommentCountAggregateOutputType = {
    id: number;
    content: number;
    created_at: number;
    updated_at: number;
    user_id: number;
    riddle_id: number;
    _all: number;
  };

  export type CommentMinAggregateInputType = {
    id?: true;
    content?: true;
    created_at?: true;
    updated_at?: true;
    user_id?: true;
    riddle_id?: true;
  };

  export type CommentMaxAggregateInputType = {
    id?: true;
    content?: true;
    created_at?: true;
    updated_at?: true;
    user_id?: true;
    riddle_id?: true;
  };

  export type CommentCountAggregateInputType = {
    id?: true;
    content?: true;
    created_at?: true;
    updated_at?: true;
    user_id?: true;
    riddle_id?: true;
    _all?: true;
  };

  export type CommentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Comments
     **/
    _count?: true | CommentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CommentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CommentMaxAggregateInputType;
  };

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
    [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>;
  };

  export type CommentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CommentWhereInput;
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[];
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum;
    having?: CommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CommentCountAggregateInputType | true;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
  };

  export type CommentGroupByOutputType = {
    id: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    riddle_id: string;
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
  };

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> & {
        [P in keyof T & keyof CommentGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
          : GetScalarType<T[P], CommentGroupByOutputType[P]>;
      }
    >
  >;

  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        content?: boolean;
        created_at?: boolean;
        updated_at?: boolean;
        user_id?: boolean;
        riddle_id?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
        riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['comment']
    >;

  export type CommentSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      user_id?: boolean;
      riddle_id?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['comment']
  >;

  export type CommentSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      user_id?: boolean;
      riddle_id?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['comment']
  >;

  export type CommentSelectScalar = {
    id?: boolean;
    content?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    riddle_id?: boolean;
  };

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'content' | 'created_at' | 'updated_at' | 'user_id' | 'riddle_id',
      ExtArgs['result']['comment']
    >;
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
  };
  export type CommentIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
  };
  export type CommentIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
  };

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'Comment';
      objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        riddle: Prisma.$RiddlesPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          content: string;
          created_at: Date;
          updated_at: Date;
          user_id: string;
          riddle_id: string;
        },
        ExtArgs['result']['comment']
      >;
      composites: {};
    };

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> =
    $Result.GetResult<Prisma.$CommentPayload, S>;

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    CommentFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: CommentCountAggregateInputType | true;
  };

  export interface CommentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment']; meta: { name: 'Comment' } };
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(
      args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(
      args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     *
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CommentFindManyArgs>(
      args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     *
     */
    create<T extends CommentCreateArgs>(
      args: SelectSubset<T, CommentCreateArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CommentCreateManyArgs>(
      args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     *
     */
    delete<T extends CommentDeleteArgs>(
      args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CommentUpdateArgs>(
      args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CommentDeleteManyArgs>(
      args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CommentUpdateManyArgs>(
      args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(
      args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(
      args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
     **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CommentAggregateArgs>(
      args: Subset<T, CommentAggregateArgs>,
    ): Prisma.PrismaPromise<GetCommentAggregateType<T>>;

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Comment model
     */
    readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    riddle<T extends RiddlesDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, RiddlesDefaultArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      | $Result.GetResult<
          Prisma.$RiddlesPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<'Comment', 'String'>;
    readonly content: FieldRef<'Comment', 'String'>;
    readonly created_at: FieldRef<'Comment', 'DateTime'>;
    readonly updated_at: FieldRef<'Comment', 'DateTime'>;
    readonly user_id: FieldRef<'Comment', 'String'>;
    readonly riddle_id: FieldRef<'Comment', 'String'>;
  }

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Comment create
   */
  export type CommentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>;
  };

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Comment update
   */
  export type CommentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>;
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>;
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput;
    /**
     * Limit how many Comments to update.
     */
    limit?: number;
  };

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>;
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput;
    /**
     * Limit how many Comments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput;
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>;
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>;
  };

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput;
    /**
     * Limit how many Comments to delete.
     */
    limit?: number;
  };

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
  };

  /**
   * Model Like
   */

  export type AggregateLike = {
    _count: LikeCountAggregateOutputType | null;
    _min: LikeMinAggregateOutputType | null;
    _max: LikeMaxAggregateOutputType | null;
  };

  export type LikeMinAggregateOutputType = {
    id: string | null;
    created_at: Date | null;
    user_id: string | null;
    riddle_id: string | null;
  };

  export type LikeMaxAggregateOutputType = {
    id: string | null;
    created_at: Date | null;
    user_id: string | null;
    riddle_id: string | null;
  };

  export type LikeCountAggregateOutputType = {
    id: number;
    created_at: number;
    user_id: number;
    riddle_id: number;
    _all: number;
  };

  export type LikeMinAggregateInputType = {
    id?: true;
    created_at?: true;
    user_id?: true;
    riddle_id?: true;
  };

  export type LikeMaxAggregateInputType = {
    id?: true;
    created_at?: true;
    user_id?: true;
    riddle_id?: true;
  };

  export type LikeCountAggregateInputType = {
    id?: true;
    created_at?: true;
    user_id?: true;
    riddle_id?: true;
    _all?: true;
  };

  export type LikeAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Like to aggregate.
     */
    where?: LikeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: LikeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Likes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Likes
     **/
    _count?: true | LikeCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: LikeMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: LikeMaxAggregateInputType;
  };

  export type GetLikeAggregateType<T extends LikeAggregateArgs> = {
    [P in keyof T & keyof AggregateLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLike[P]>
      : GetScalarType<T[P], AggregateLike[P]>;
  };

  export type LikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      where?: LikeWhereInput;
      orderBy?: LikeOrderByWithAggregationInput | LikeOrderByWithAggregationInput[];
      by: LikeScalarFieldEnum[] | LikeScalarFieldEnum;
      having?: LikeScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: LikeCountAggregateInputType | true;
      _min?: LikeMinAggregateInputType;
      _max?: LikeMaxAggregateInputType;
    };

  export type LikeGroupByOutputType = {
    id: string;
    created_at: Date;
    user_id: string;
    riddle_id: string;
    _count: LikeCountAggregateOutputType | null;
    _min: LikeMinAggregateOutputType | null;
    _max: LikeMaxAggregateOutputType | null;
  };

  type GetLikeGroupByPayload<T extends LikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LikeGroupByOutputType, T['by']> & {
        [P in keyof T & keyof LikeGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], LikeGroupByOutputType[P]>
          : GetScalarType<T[P], LikeGroupByOutputType[P]>;
      }
    >
  >;

  export type LikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        created_at?: boolean;
        user_id?: boolean;
        riddle_id?: boolean;
        user?: boolean | UserDefaultArgs<ExtArgs>;
        riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['like']
    >;

  export type LikeSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      created_at?: boolean;
      user_id?: boolean;
      riddle_id?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['like']
  >;

  export type LikeSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      created_at?: boolean;
      user_id?: boolean;
      riddle_id?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
      riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['like']
  >;

  export type LikeSelectScalar = {
    id?: boolean;
    created_at?: boolean;
    user_id?: boolean;
    riddle_id?: boolean;
  };

  export type LikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<'id' | 'created_at' | 'user_id' | 'riddle_id', ExtArgs['result']['like']>;
  export type LikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
  };
  export type LikeIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
  };
  export type LikeIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
    riddle?: boolean | RiddlesDefaultArgs<ExtArgs>;
  };

  export type $LikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Like';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
      riddle: Prisma.$RiddlesPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        created_at: Date;
        user_id: string;
        riddle_id: string;
      },
      ExtArgs['result']['like']
    >;
    composites: {};
  };

  type LikeGetPayload<S extends boolean | null | undefined | LikeDefaultArgs> = $Result.GetResult<
    Prisma.$LikePayload,
    S
  >;

  type LikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    LikeFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: LikeCountAggregateInputType | true;
  };

  export interface LikeDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Like']; meta: { name: 'Like' } };
    /**
     * Find zero or one Like that matches the filter.
     * @param {LikeFindUniqueArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LikeFindUniqueArgs>(
      args: SelectSubset<T, LikeFindUniqueArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Like that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LikeFindUniqueOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LikeFindUniqueOrThrowArgs>(
      args: SelectSubset<T, LikeFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Like that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LikeFindFirstArgs>(
      args?: SelectSubset<T, LikeFindFirstArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Like that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LikeFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LikeFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Likes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Likes
     * const likes = await prisma.like.findMany()
     *
     * // Get first 10 Likes
     * const likes = await prisma.like.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const likeWithIdOnly = await prisma.like.findMany({ select: { id: true } })
     *
     */
    findMany<T extends LikeFindManyArgs>(
      args?: SelectSubset<T, LikeFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a Like.
     * @param {LikeCreateArgs} args - Arguments to create a Like.
     * @example
     * // Create one Like
     * const Like = await prisma.like.create({
     *   data: {
     *     // ... data to create a Like
     *   }
     * })
     *
     */
    create<T extends LikeCreateArgs>(
      args: SelectSubset<T, LikeCreateArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Likes.
     * @param {LikeCreateManyArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends LikeCreateManyArgs>(
      args?: SelectSubset<T, LikeCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Likes and returns the data saved in the database.
     * @param {LikeCreateManyAndReturnArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends LikeCreateManyAndReturnArgs>(
      args?: SelectSubset<T, LikeCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Delete a Like.
     * @param {LikeDeleteArgs} args - Arguments to delete one Like.
     * @example
     * // Delete one Like
     * const Like = await prisma.like.delete({
     *   where: {
     *     // ... filter to delete one Like
     *   }
     * })
     *
     */
    delete<T extends LikeDeleteArgs>(
      args: SelectSubset<T, LikeDeleteArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Like.
     * @param {LikeUpdateArgs} args - Arguments to update one Like.
     * @example
     * // Update one Like
     * const like = await prisma.like.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends LikeUpdateArgs>(
      args: SelectSubset<T, LikeUpdateArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Likes.
     * @param {LikeDeleteManyArgs} args - Arguments to filter Likes to delete.
     * @example
     * // Delete a few Likes
     * const { count } = await prisma.like.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends LikeDeleteManyArgs>(
      args?: SelectSubset<T, LikeDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends LikeUpdateManyArgs>(
      args: SelectSubset<T, LikeUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Likes and returns the data updated in the database.
     * @param {LikeUpdateManyAndReturnArgs} args - Arguments to update many Likes.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends LikeUpdateManyAndReturnArgs>(
      args: SelectSubset<T, LikeUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >;

    /**
     * Create or update one Like.
     * @param {LikeUpsertArgs} args - Arguments to update or create a Like.
     * @example
     * // Update or create a Like
     * const like = await prisma.like.upsert({
     *   create: {
     *     // ... data to create a Like
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Like we want to update
     *   }
     * })
     */
    upsert<T extends LikeUpsertArgs>(
      args: SelectSubset<T, LikeUpsertArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<Prisma.$LikePayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeCountArgs} args - Arguments to filter Likes to count.
     * @example
     * // Count the number of Likes
     * const count = await prisma.like.count({
     *   where: {
     *     // ... the filter for the Likes we want to count
     *   }
     * })
     **/
    count<T extends LikeCountArgs>(
      args?: Subset<T, LikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LikeCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends LikeAggregateArgs>(
      args: Subset<T, LikeAggregateArgs>,
    ): Prisma.PrismaPromise<GetLikeAggregateType<T>>;

    /**
     * Group by Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends LikeGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LikeGroupByArgs['orderBy'] }
        : { orderBy?: LikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, LikeGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Like model
     */
    readonly fields: LikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Like.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LikeClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    riddle<T extends RiddlesDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, RiddlesDefaultArgs<ExtArgs>>,
    ): Prisma__RiddlesClient<
      | $Result.GetResult<
          Prisma.$RiddlesPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Like model
   */
  interface LikeFieldRefs {
    readonly id: FieldRef<'Like', 'String'>;
    readonly created_at: FieldRef<'Like', 'DateTime'>;
    readonly user_id: FieldRef<'Like', 'String'>;
    readonly riddle_id: FieldRef<'Like', 'String'>;
  }

  // Custom InputTypes
  /**
   * Like findUnique
   */
  export type LikeFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like findUniqueOrThrow
   */
  export type LikeFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like findFirst
   */
  export type LikeFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Likes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Like findFirstOrThrow
   */
  export type LikeFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Likes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Like findMany
   */
  export type LikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Like
       */
      select?: LikeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Like
       */
      omit?: LikeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: LikeInclude<ExtArgs> | null;
      /**
       * Filter, which Likes to fetch.
       */
      where?: LikeWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Likes to fetch.
       */
      orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Likes.
       */
      cursor?: LikeWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Likes from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Likes.
       */
      skip?: number;
      distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
    };

  /**
   * Like create
   */
  export type LikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * The data needed to create a Like.
     */
    data: XOR<LikeCreateInput, LikeUncheckedCreateInput>;
  };

  /**
   * Like createMany
   */
  export type LikeCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Like createManyAndReturn
   */
  export type LikeCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Like update
   */
  export type LikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * The data needed to update a Like.
     */
    data: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>;
    /**
     * Choose, which Like to update.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like updateMany
   */
  export type LikeUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>;
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput;
    /**
     * Limit how many Likes to update.
     */
    limit?: number;
  };

  /**
   * Like updateManyAndReturn
   */
  export type LikeUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>;
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput;
    /**
     * Limit how many Likes to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Like upsert
   */
  export type LikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * The filter to search for the Like to update in case it exists.
     */
    where: LikeWhereUniqueInput;
    /**
     * In case the Like found by the `where` argument doesn't exist, create a new Like with this data.
     */
    create: XOR<LikeCreateInput, LikeUncheckedCreateInput>;
    /**
     * In case the Like was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>;
  };

  /**
   * Like delete
   */
  export type LikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter which Like to delete.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like deleteMany
   */
  export type LikeDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Likes to delete
     */
    where?: LikeWhereInput;
    /**
     * Limit how many Likes to delete.
     */
    limit?: number;
  };

  /**
   * Like without action
   */
  export type LikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the Like
       */
      select?: LikeSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Like
       */
      omit?: LikeOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: LikeInclude<ExtArgs> | null;
    };

  /**
   * Model AIPrompt
   */

  export type AggregateAIPrompt = {
    _count: AIPromptCountAggregateOutputType | null;
    _min: AIPromptMinAggregateOutputType | null;
    _max: AIPromptMaxAggregateOutputType | null;
  };

  export type AIPromptMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    template: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type AIPromptMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    template: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type AIPromptCountAggregateOutputType = {
    id: number;
    name: number;
    template: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type AIPromptMinAggregateInputType = {
    id?: true;
    name?: true;
    template?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type AIPromptMaxAggregateInputType = {
    id?: true;
    name?: true;
    template?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type AIPromptCountAggregateInputType = {
    id?: true;
    name?: true;
    template?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type AIPromptAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AIPrompt to aggregate.
     */
    where?: AIPromptWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AIPrompts to fetch.
     */
    orderBy?: AIPromptOrderByWithRelationInput | AIPromptOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AIPromptWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AIPrompts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AIPrompts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AIPrompts
     **/
    _count?: true | AIPromptCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AIPromptMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AIPromptMaxAggregateInputType;
  };

  export type GetAIPromptAggregateType<T extends AIPromptAggregateArgs> = {
    [P in keyof T & keyof AggregateAIPrompt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAIPrompt[P]>
      : GetScalarType<T[P], AggregateAIPrompt[P]>;
  };

  export type AIPromptGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AIPromptWhereInput;
    orderBy?: AIPromptOrderByWithAggregationInput | AIPromptOrderByWithAggregationInput[];
    by: AIPromptScalarFieldEnum[] | AIPromptScalarFieldEnum;
    having?: AIPromptScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AIPromptCountAggregateInputType | true;
    _min?: AIPromptMinAggregateInputType;
    _max?: AIPromptMaxAggregateInputType;
  };

  export type AIPromptGroupByOutputType = {
    id: string;
    name: string;
    template: string;
    created_at: Date;
    updated_at: Date;
    _count: AIPromptCountAggregateOutputType | null;
    _min: AIPromptMinAggregateOutputType | null;
    _max: AIPromptMaxAggregateOutputType | null;
  };

  type GetAIPromptGroupByPayload<T extends AIPromptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AIPromptGroupByOutputType, T['by']> & {
        [P in keyof T & keyof AIPromptGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], AIPromptGroupByOutputType[P]>
          : GetScalarType<T[P], AIPromptGroupByOutputType[P]>;
      }
    >
  >;

  export type AIPromptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean;
        name?: boolean;
        template?: boolean;
        created_at?: boolean;
        updated_at?: boolean;
      },
      ExtArgs['result']['aIPrompt']
    >;

  export type AIPromptSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      template?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs['result']['aIPrompt']
  >;

  export type AIPromptSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      template?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs['result']['aIPrompt']
  >;

  export type AIPromptSelectScalar = {
    id?: boolean;
    name?: boolean;
    template?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type AIPromptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'name' | 'template' | 'created_at' | 'updated_at',
      ExtArgs['result']['aIPrompt']
    >;

  export type $AIPromptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      name: 'AIPrompt';
      objects: {};
      scalars: $Extensions.GetPayloadResult<
        {
          id: string;
          name: string;
          template: string;
          created_at: Date;
          updated_at: Date;
        },
        ExtArgs['result']['aIPrompt']
      >;
      composites: {};
    };

  type AIPromptGetPayload<S extends boolean | null | undefined | AIPromptDefaultArgs> =
    $Result.GetResult<Prisma.$AIPromptPayload, S>;

  type AIPromptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    AIPromptFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: AIPromptCountAggregateInputType | true;
  };

  export interface AIPromptDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AIPrompt'];
      meta: { name: 'AIPrompt' };
    };
    /**
     * Find zero or one AIPrompt that matches the filter.
     * @param {AIPromptFindUniqueArgs} args - Arguments to find a AIPrompt
     * @example
     * // Get one AIPrompt
     * const aIPrompt = await prisma.aIPrompt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AIPromptFindUniqueArgs>(
      args: SelectSubset<T, AIPromptFindUniqueArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<
        Prisma.$AIPromptPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one AIPrompt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AIPromptFindUniqueOrThrowArgs} args - Arguments to find a AIPrompt
     * @example
     * // Get one AIPrompt
     * const aIPrompt = await prisma.aIPrompt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AIPromptFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AIPromptFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<
        Prisma.$AIPromptPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AIPrompt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIPromptFindFirstArgs} args - Arguments to find a AIPrompt
     * @example
     * // Get one AIPrompt
     * const aIPrompt = await prisma.aIPrompt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AIPromptFindFirstArgs>(
      args?: SelectSubset<T, AIPromptFindFirstArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<Prisma.$AIPromptPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first AIPrompt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIPromptFindFirstOrThrowArgs} args - Arguments to find a AIPrompt
     * @example
     * // Get one AIPrompt
     * const aIPrompt = await prisma.aIPrompt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AIPromptFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AIPromptFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<Prisma.$AIPromptPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more AIPrompts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIPromptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AIPrompts
     * const aIPrompts = await prisma.aIPrompt.findMany()
     *
     * // Get first 10 AIPrompts
     * const aIPrompts = await prisma.aIPrompt.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const aIPromptWithIdOnly = await prisma.aIPrompt.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AIPromptFindManyArgs>(
      args?: SelectSubset<T, AIPromptFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AIPromptPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
    >;

    /**
     * Create a AIPrompt.
     * @param {AIPromptCreateArgs} args - Arguments to create a AIPrompt.
     * @example
     * // Create one AIPrompt
     * const AIPrompt = await prisma.aIPrompt.create({
     *   data: {
     *     // ... data to create a AIPrompt
     *   }
     * })
     *
     */
    create<T extends AIPromptCreateArgs>(
      args: SelectSubset<T, AIPromptCreateArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<Prisma.$AIPromptPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many AIPrompts.
     * @param {AIPromptCreateManyArgs} args - Arguments to create many AIPrompts.
     * @example
     * // Create many AIPrompts
     * const aIPrompt = await prisma.aIPrompt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AIPromptCreateManyArgs>(
      args?: SelectSubset<T, AIPromptCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many AIPrompts and returns the data saved in the database.
     * @param {AIPromptCreateManyAndReturnArgs} args - Arguments to create many AIPrompts.
     * @example
     * // Create many AIPrompts
     * const aIPrompt = await prisma.aIPrompt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AIPrompts and only return the `id`
     * const aIPromptWithIdOnly = await prisma.aIPrompt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AIPromptCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AIPromptCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AIPromptPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a AIPrompt.
     * @param {AIPromptDeleteArgs} args - Arguments to delete one AIPrompt.
     * @example
     * // Delete one AIPrompt
     * const AIPrompt = await prisma.aIPrompt.delete({
     *   where: {
     *     // ... filter to delete one AIPrompt
     *   }
     * })
     *
     */
    delete<T extends AIPromptDeleteArgs>(
      args: SelectSubset<T, AIPromptDeleteArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<Prisma.$AIPromptPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one AIPrompt.
     * @param {AIPromptUpdateArgs} args - Arguments to update one AIPrompt.
     * @example
     * // Update one AIPrompt
     * const aIPrompt = await prisma.aIPrompt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AIPromptUpdateArgs>(
      args: SelectSubset<T, AIPromptUpdateArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<Prisma.$AIPromptPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more AIPrompts.
     * @param {AIPromptDeleteManyArgs} args - Arguments to filter AIPrompts to delete.
     * @example
     * // Delete a few AIPrompts
     * const { count } = await prisma.aIPrompt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AIPromptDeleteManyArgs>(
      args?: SelectSubset<T, AIPromptDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AIPrompts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIPromptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AIPrompts
     * const aIPrompt = await prisma.aIPrompt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AIPromptUpdateManyArgs>(
      args: SelectSubset<T, AIPromptUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AIPrompts and returns the data updated in the database.
     * @param {AIPromptUpdateManyAndReturnArgs} args - Arguments to update many AIPrompts.
     * @example
     * // Update many AIPrompts
     * const aIPrompt = await prisma.aIPrompt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AIPrompts and only return the `id`
     * const aIPromptWithIdOnly = await prisma.aIPrompt.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AIPromptUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AIPromptUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AIPromptPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one AIPrompt.
     * @param {AIPromptUpsertArgs} args - Arguments to update or create a AIPrompt.
     * @example
     * // Update or create a AIPrompt
     * const aIPrompt = await prisma.aIPrompt.upsert({
     *   create: {
     *     // ... data to create a AIPrompt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AIPrompt we want to update
     *   }
     * })
     */
    upsert<T extends AIPromptUpsertArgs>(
      args: SelectSubset<T, AIPromptUpsertArgs<ExtArgs>>,
    ): Prisma__AIPromptClient<
      $Result.GetResult<Prisma.$AIPromptPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of AIPrompts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIPromptCountArgs} args - Arguments to filter AIPrompts to count.
     * @example
     * // Count the number of AIPrompts
     * const count = await prisma.aIPrompt.count({
     *   where: {
     *     // ... the filter for the AIPrompts we want to count
     *   }
     * })
     **/
    count<T extends AIPromptCountArgs>(
      args?: Subset<T, AIPromptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AIPromptCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AIPrompt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIPromptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AIPromptAggregateArgs>(
      args: Subset<T, AIPromptAggregateArgs>,
    ): Prisma.PrismaPromise<GetAIPromptAggregateType<T>>;

    /**
     * Group by AIPrompt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIPromptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AIPromptGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AIPromptGroupByArgs['orderBy'] }
        : { orderBy?: AIPromptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AIPromptGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAIPromptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AIPrompt model
     */
    readonly fields: AIPromptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AIPrompt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AIPromptClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AIPrompt model
   */
  interface AIPromptFieldRefs {
    readonly id: FieldRef<'AIPrompt', 'String'>;
    readonly name: FieldRef<'AIPrompt', 'String'>;
    readonly template: FieldRef<'AIPrompt', 'String'>;
    readonly created_at: FieldRef<'AIPrompt', 'DateTime'>;
    readonly updated_at: FieldRef<'AIPrompt', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * AIPrompt findUnique
   */
  export type AIPromptFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * Filter, which AIPrompt to fetch.
     */
    where: AIPromptWhereUniqueInput;
  };

  /**
   * AIPrompt findUniqueOrThrow
   */
  export type AIPromptFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * Filter, which AIPrompt to fetch.
     */
    where: AIPromptWhereUniqueInput;
  };

  /**
   * AIPrompt findFirst
   */
  export type AIPromptFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * Filter, which AIPrompt to fetch.
     */
    where?: AIPromptWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AIPrompts to fetch.
     */
    orderBy?: AIPromptOrderByWithRelationInput | AIPromptOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AIPrompts.
     */
    cursor?: AIPromptWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AIPrompts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AIPrompts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AIPrompts.
     */
    distinct?: AIPromptScalarFieldEnum | AIPromptScalarFieldEnum[];
  };

  /**
   * AIPrompt findFirstOrThrow
   */
  export type AIPromptFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * Filter, which AIPrompt to fetch.
     */
    where?: AIPromptWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AIPrompts to fetch.
     */
    orderBy?: AIPromptOrderByWithRelationInput | AIPromptOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AIPrompts.
     */
    cursor?: AIPromptWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AIPrompts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AIPrompts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AIPrompts.
     */
    distinct?: AIPromptScalarFieldEnum | AIPromptScalarFieldEnum[];
  };

  /**
   * AIPrompt findMany
   */
  export type AIPromptFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * Filter, which AIPrompts to fetch.
     */
    where?: AIPromptWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AIPrompts to fetch.
     */
    orderBy?: AIPromptOrderByWithRelationInput | AIPromptOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AIPrompts.
     */
    cursor?: AIPromptWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AIPrompts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AIPrompts.
     */
    skip?: number;
    distinct?: AIPromptScalarFieldEnum | AIPromptScalarFieldEnum[];
  };

  /**
   * AIPrompt create
   */
  export type AIPromptCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * The data needed to create a AIPrompt.
     */
    data: XOR<AIPromptCreateInput, AIPromptUncheckedCreateInput>;
  };

  /**
   * AIPrompt createMany
   */
  export type AIPromptCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AIPrompts.
     */
    data: AIPromptCreateManyInput | AIPromptCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AIPrompt createManyAndReturn
   */
  export type AIPromptCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * The data used to create many AIPrompts.
     */
    data: AIPromptCreateManyInput | AIPromptCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AIPrompt update
   */
  export type AIPromptUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * The data needed to update a AIPrompt.
     */
    data: XOR<AIPromptUpdateInput, AIPromptUncheckedUpdateInput>;
    /**
     * Choose, which AIPrompt to update.
     */
    where: AIPromptWhereUniqueInput;
  };

  /**
   * AIPrompt updateMany
   */
  export type AIPromptUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AIPrompts.
     */
    data: XOR<AIPromptUpdateManyMutationInput, AIPromptUncheckedUpdateManyInput>;
    /**
     * Filter which AIPrompts to update
     */
    where?: AIPromptWhereInput;
    /**
     * Limit how many AIPrompts to update.
     */
    limit?: number;
  };

  /**
   * AIPrompt updateManyAndReturn
   */
  export type AIPromptUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * The data used to update AIPrompts.
     */
    data: XOR<AIPromptUpdateManyMutationInput, AIPromptUncheckedUpdateManyInput>;
    /**
     * Filter which AIPrompts to update
     */
    where?: AIPromptWhereInput;
    /**
     * Limit how many AIPrompts to update.
     */
    limit?: number;
  };

  /**
   * AIPrompt upsert
   */
  export type AIPromptUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * The filter to search for the AIPrompt to update in case it exists.
     */
    where: AIPromptWhereUniqueInput;
    /**
     * In case the AIPrompt found by the `where` argument doesn't exist, create a new AIPrompt with this data.
     */
    create: XOR<AIPromptCreateInput, AIPromptUncheckedCreateInput>;
    /**
     * In case the AIPrompt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AIPromptUpdateInput, AIPromptUncheckedUpdateInput>;
  };

  /**
   * AIPrompt delete
   */
  export type AIPromptDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
    /**
     * Filter which AIPrompt to delete.
     */
    where: AIPromptWhereUniqueInput;
  };

  /**
   * AIPrompt deleteMany
   */
  export type AIPromptDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AIPrompts to delete
     */
    where?: AIPromptWhereInput;
    /**
     * Limit how many AIPrompts to delete.
     */
    limit?: number;
  };

  /**
   * AIPrompt without action
   */
  export type AIPromptDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AIPrompt
     */
    select?: AIPromptSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AIPrompt
     */
    omit?: AIPromptOmit<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const UserScalarFieldEnum: {
    id: 'id';
    email: 'email';
    password: 'password';
    name: 'name';
    onboarding_completed: 'onboarding_completed';
    created_at: 'created_at';
    updated_at: 'updated_at';
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const SessionScalarFieldEnum: {
    id: 'id';
    token: 'token';
    refresh_token: 'refresh_token';
    created_at: 'created_at';
    last_activity_at: 'last_activity_at';
    expires_at: 'expires_at';
    userId: 'userId';
  };

  export type SessionScalarFieldEnum =
    (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];

  export const RiddlesScalarFieldEnum: {
    id: 'id';
    content: 'content';
    answer: 'answer';
    prompt_context: 'prompt_context';
    is_public: 'is_public';
    is_verified: 'is_verified';
    likes_count: 'likes_count';
    comments_count: 'comments_count';
    created_at: 'created_at';
    updated_at: 'updated_at';
    author_id: 'author_id';
  };

  export type RiddlesScalarFieldEnum =
    (typeof RiddlesScalarFieldEnum)[keyof typeof RiddlesScalarFieldEnum];

  export const CommentScalarFieldEnum: {
    id: 'id';
    content: 'content';
    created_at: 'created_at';
    updated_at: 'updated_at';
    user_id: 'user_id';
    riddle_id: 'riddle_id';
  };

  export type CommentScalarFieldEnum =
    (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];

  export const LikeScalarFieldEnum: {
    id: 'id';
    created_at: 'created_at';
    user_id: 'user_id';
    riddle_id: 'riddle_id';
  };

  export type LikeScalarFieldEnum = (typeof LikeScalarFieldEnum)[keyof typeof LikeScalarFieldEnum];

  export const AIPromptScalarFieldEnum: {
    id: 'id';
    name: 'name';
    template: 'template';
    created_at: 'created_at';
    updated_at: 'updated_at';
  };

  export type AIPromptScalarFieldEnum =
    (typeof AIPromptScalarFieldEnum)[keyof typeof AIPromptScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
  };

  export type NullableJsonNullValueInput =
    (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;

  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'QueryMode'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;

  /**
   * Deep Input Types
   */

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    email?: StringFilter<'User'> | string;
    password?: StringFilter<'User'> | string;
    name?: StringNullableFilter<'User'> | string | null;
    onboarding_completed?: BoolNullableFilter<'User'> | boolean | null;
    created_at?: DateTimeFilter<'User'> | Date | string;
    updated_at?: DateTimeFilter<'User'> | Date | string;
    sessions?: SessionListRelationFilter;
    riddles?: RiddlesListRelationFilter;
    comments?: CommentListRelationFilter;
    likes?: LikeListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrderInput | SortOrder;
    onboarding_completed?: SortOrderInput | SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    sessions?: SessionOrderByRelationAggregateInput;
    riddles?: RiddlesOrderByRelationAggregateInput;
    comments?: CommentOrderByRelationAggregateInput;
    likes?: LikeOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      password?: StringFilter<'User'> | string;
      name?: StringNullableFilter<'User'> | string | null;
      onboarding_completed?: BoolNullableFilter<'User'> | boolean | null;
      created_at?: DateTimeFilter<'User'> | Date | string;
      updated_at?: DateTimeFilter<'User'> | Date | string;
      sessions?: SessionListRelationFilter;
      riddles?: RiddlesListRelationFilter;
      comments?: CommentListRelationFilter;
      likes?: LikeListRelationFilter;
    },
    'id' | 'email'
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrderInput | SortOrder;
    onboarding_completed?: SortOrderInput | SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    email?: StringWithAggregatesFilter<'User'> | string;
    password?: StringWithAggregatesFilter<'User'> | string;
    name?: StringNullableWithAggregatesFilter<'User'> | string | null;
    onboarding_completed?: BoolNullableWithAggregatesFilter<'User'> | boolean | null;
    created_at?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    updated_at?: DateTimeWithAggregatesFilter<'User'> | Date | string;
  };

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[];
    OR?: SessionWhereInput[];
    NOT?: SessionWhereInput | SessionWhereInput[];
    id?: StringFilter<'Session'> | string;
    token?: StringFilter<'Session'> | string;
    refresh_token?: StringNullableFilter<'Session'> | string | null;
    created_at?: DateTimeFilter<'Session'> | Date | string;
    last_activity_at?: DateTimeNullableFilter<'Session'> | Date | string | null;
    expires_at?: DateTimeFilter<'Session'> | Date | string;
    userId?: StringFilter<'Session'> | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder;
    token?: SortOrder;
    refresh_token?: SortOrderInput | SortOrder;
    created_at?: SortOrder;
    last_activity_at?: SortOrderInput | SortOrder;
    expires_at?: SortOrder;
    userId?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type SessionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      token?: string;
      AND?: SessionWhereInput | SessionWhereInput[];
      OR?: SessionWhereInput[];
      NOT?: SessionWhereInput | SessionWhereInput[];
      refresh_token?: StringNullableFilter<'Session'> | string | null;
      created_at?: DateTimeFilter<'Session'> | Date | string;
      last_activity_at?: DateTimeNullableFilter<'Session'> | Date | string | null;
      expires_at?: DateTimeFilter<'Session'> | Date | string;
      userId?: StringFilter<'Session'> | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'token'
  >;

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder;
    token?: SortOrder;
    refresh_token?: SortOrderInput | SortOrder;
    created_at?: SortOrder;
    last_activity_at?: SortOrderInput | SortOrder;
    expires_at?: SortOrder;
    userId?: SortOrder;
    _count?: SessionCountOrderByAggregateInput;
    _max?: SessionMaxOrderByAggregateInput;
    _min?: SessionMinOrderByAggregateInput;
  };

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[];
    OR?: SessionScalarWhereWithAggregatesInput[];
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Session'> | string;
    token?: StringWithAggregatesFilter<'Session'> | string;
    refresh_token?: StringNullableWithAggregatesFilter<'Session'> | string | null;
    created_at?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
    last_activity_at?: DateTimeNullableWithAggregatesFilter<'Session'> | Date | string | null;
    expires_at?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
    userId?: StringWithAggregatesFilter<'Session'> | string;
  };

  export type RiddlesWhereInput = {
    AND?: RiddlesWhereInput | RiddlesWhereInput[];
    OR?: RiddlesWhereInput[];
    NOT?: RiddlesWhereInput | RiddlesWhereInput[];
    id?: StringFilter<'Riddles'> | string;
    content?: StringFilter<'Riddles'> | string;
    answer?: StringFilter<'Riddles'> | string;
    prompt_context?: JsonNullableFilter<'Riddles'>;
    is_public?: BoolFilter<'Riddles'> | boolean;
    is_verified?: BoolFilter<'Riddles'> | boolean;
    likes_count?: IntFilter<'Riddles'> | number;
    comments_count?: IntFilter<'Riddles'> | number;
    created_at?: DateTimeFilter<'Riddles'> | Date | string;
    updated_at?: DateTimeFilter<'Riddles'> | Date | string;
    author_id?: StringFilter<'Riddles'> | string;
    author?: XOR<UserScalarRelationFilter, UserWhereInput>;
    comments?: CommentListRelationFilter;
    likes?: LikeListRelationFilter;
  };

  export type RiddlesOrderByWithRelationInput = {
    id?: SortOrder;
    content?: SortOrder;
    answer?: SortOrder;
    prompt_context?: SortOrderInput | SortOrder;
    is_public?: SortOrder;
    is_verified?: SortOrder;
    likes_count?: SortOrder;
    comments_count?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    author_id?: SortOrder;
    author?: UserOrderByWithRelationInput;
    comments?: CommentOrderByRelationAggregateInput;
    likes?: LikeOrderByRelationAggregateInput;
  };

  export type RiddlesWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: RiddlesWhereInput | RiddlesWhereInput[];
      OR?: RiddlesWhereInput[];
      NOT?: RiddlesWhereInput | RiddlesWhereInput[];
      content?: StringFilter<'Riddles'> | string;
      answer?: StringFilter<'Riddles'> | string;
      prompt_context?: JsonNullableFilter<'Riddles'>;
      is_public?: BoolFilter<'Riddles'> | boolean;
      is_verified?: BoolFilter<'Riddles'> | boolean;
      likes_count?: IntFilter<'Riddles'> | number;
      comments_count?: IntFilter<'Riddles'> | number;
      created_at?: DateTimeFilter<'Riddles'> | Date | string;
      updated_at?: DateTimeFilter<'Riddles'> | Date | string;
      author_id?: StringFilter<'Riddles'> | string;
      author?: XOR<UserScalarRelationFilter, UserWhereInput>;
      comments?: CommentListRelationFilter;
      likes?: LikeListRelationFilter;
    },
    'id'
  >;

  export type RiddlesOrderByWithAggregationInput = {
    id?: SortOrder;
    content?: SortOrder;
    answer?: SortOrder;
    prompt_context?: SortOrderInput | SortOrder;
    is_public?: SortOrder;
    is_verified?: SortOrder;
    likes_count?: SortOrder;
    comments_count?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    author_id?: SortOrder;
    _count?: RiddlesCountOrderByAggregateInput;
    _avg?: RiddlesAvgOrderByAggregateInput;
    _max?: RiddlesMaxOrderByAggregateInput;
    _min?: RiddlesMinOrderByAggregateInput;
    _sum?: RiddlesSumOrderByAggregateInput;
  };

  export type RiddlesScalarWhereWithAggregatesInput = {
    AND?: RiddlesScalarWhereWithAggregatesInput | RiddlesScalarWhereWithAggregatesInput[];
    OR?: RiddlesScalarWhereWithAggregatesInput[];
    NOT?: RiddlesScalarWhereWithAggregatesInput | RiddlesScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Riddles'> | string;
    content?: StringWithAggregatesFilter<'Riddles'> | string;
    answer?: StringWithAggregatesFilter<'Riddles'> | string;
    prompt_context?: JsonNullableWithAggregatesFilter<'Riddles'>;
    is_public?: BoolWithAggregatesFilter<'Riddles'> | boolean;
    is_verified?: BoolWithAggregatesFilter<'Riddles'> | boolean;
    likes_count?: IntWithAggregatesFilter<'Riddles'> | number;
    comments_count?: IntWithAggregatesFilter<'Riddles'> | number;
    created_at?: DateTimeWithAggregatesFilter<'Riddles'> | Date | string;
    updated_at?: DateTimeWithAggregatesFilter<'Riddles'> | Date | string;
    author_id?: StringWithAggregatesFilter<'Riddles'> | string;
  };

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[];
    OR?: CommentWhereInput[];
    NOT?: CommentWhereInput | CommentWhereInput[];
    id?: StringFilter<'Comment'> | string;
    content?: StringFilter<'Comment'> | string;
    created_at?: DateTimeFilter<'Comment'> | Date | string;
    updated_at?: DateTimeFilter<'Comment'> | Date | string;
    user_id?: StringFilter<'Comment'> | string;
    riddle_id?: StringFilter<'Comment'> | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    riddle?: XOR<RiddlesScalarRelationFilter, RiddlesWhereInput>;
  };

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder;
    content?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
    user?: UserOrderByWithRelationInput;
    riddle?: RiddlesOrderByWithRelationInput;
  };

  export type CommentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: CommentWhereInput | CommentWhereInput[];
      OR?: CommentWhereInput[];
      NOT?: CommentWhereInput | CommentWhereInput[];
      content?: StringFilter<'Comment'> | string;
      created_at?: DateTimeFilter<'Comment'> | Date | string;
      updated_at?: DateTimeFilter<'Comment'> | Date | string;
      user_id?: StringFilter<'Comment'> | string;
      riddle_id?: StringFilter<'Comment'> | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      riddle?: XOR<RiddlesScalarRelationFilter, RiddlesWhereInput>;
    },
    'id'
  >;

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder;
    content?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
    _count?: CommentCountOrderByAggregateInput;
    _max?: CommentMaxOrderByAggregateInput;
    _min?: CommentMinOrderByAggregateInput;
  };

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[];
    OR?: CommentScalarWhereWithAggregatesInput[];
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Comment'> | string;
    content?: StringWithAggregatesFilter<'Comment'> | string;
    created_at?: DateTimeWithAggregatesFilter<'Comment'> | Date | string;
    updated_at?: DateTimeWithAggregatesFilter<'Comment'> | Date | string;
    user_id?: StringWithAggregatesFilter<'Comment'> | string;
    riddle_id?: StringWithAggregatesFilter<'Comment'> | string;
  };

  export type LikeWhereInput = {
    AND?: LikeWhereInput | LikeWhereInput[];
    OR?: LikeWhereInput[];
    NOT?: LikeWhereInput | LikeWhereInput[];
    id?: StringFilter<'Like'> | string;
    created_at?: DateTimeFilter<'Like'> | Date | string;
    user_id?: StringFilter<'Like'> | string;
    riddle_id?: StringFilter<'Like'> | string;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    riddle?: XOR<RiddlesScalarRelationFilter, RiddlesWhereInput>;
  };

  export type LikeOrderByWithRelationInput = {
    id?: SortOrder;
    created_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
    user?: UserOrderByWithRelationInput;
    riddle?: RiddlesOrderByWithRelationInput;
  };

  export type LikeWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      user_id_riddle_id?: LikeUser_idRiddle_idCompoundUniqueInput;
      AND?: LikeWhereInput | LikeWhereInput[];
      OR?: LikeWhereInput[];
      NOT?: LikeWhereInput | LikeWhereInput[];
      created_at?: DateTimeFilter<'Like'> | Date | string;
      user_id?: StringFilter<'Like'> | string;
      riddle_id?: StringFilter<'Like'> | string;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
      riddle?: XOR<RiddlesScalarRelationFilter, RiddlesWhereInput>;
    },
    'id' | 'user_id_riddle_id'
  >;

  export type LikeOrderByWithAggregationInput = {
    id?: SortOrder;
    created_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
    _count?: LikeCountOrderByAggregateInput;
    _max?: LikeMaxOrderByAggregateInput;
    _min?: LikeMinOrderByAggregateInput;
  };

  export type LikeScalarWhereWithAggregatesInput = {
    AND?: LikeScalarWhereWithAggregatesInput | LikeScalarWhereWithAggregatesInput[];
    OR?: LikeScalarWhereWithAggregatesInput[];
    NOT?: LikeScalarWhereWithAggregatesInput | LikeScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Like'> | string;
    created_at?: DateTimeWithAggregatesFilter<'Like'> | Date | string;
    user_id?: StringWithAggregatesFilter<'Like'> | string;
    riddle_id?: StringWithAggregatesFilter<'Like'> | string;
  };

  export type AIPromptWhereInput = {
    AND?: AIPromptWhereInput | AIPromptWhereInput[];
    OR?: AIPromptWhereInput[];
    NOT?: AIPromptWhereInput | AIPromptWhereInput[];
    id?: StringFilter<'AIPrompt'> | string;
    name?: StringFilter<'AIPrompt'> | string;
    template?: StringFilter<'AIPrompt'> | string;
    created_at?: DateTimeFilter<'AIPrompt'> | Date | string;
    updated_at?: DateTimeFilter<'AIPrompt'> | Date | string;
  };

  export type AIPromptOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    template?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type AIPromptWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      name?: string;
      AND?: AIPromptWhereInput | AIPromptWhereInput[];
      OR?: AIPromptWhereInput[];
      NOT?: AIPromptWhereInput | AIPromptWhereInput[];
      template?: StringFilter<'AIPrompt'> | string;
      created_at?: DateTimeFilter<'AIPrompt'> | Date | string;
      updated_at?: DateTimeFilter<'AIPrompt'> | Date | string;
    },
    'id' | 'name'
  >;

  export type AIPromptOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    template?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    _count?: AIPromptCountOrderByAggregateInput;
    _max?: AIPromptMaxOrderByAggregateInput;
    _min?: AIPromptMinOrderByAggregateInput;
  };

  export type AIPromptScalarWhereWithAggregatesInput = {
    AND?: AIPromptScalarWhereWithAggregatesInput | AIPromptScalarWhereWithAggregatesInput[];
    OR?: AIPromptScalarWhereWithAggregatesInput[];
    NOT?: AIPromptScalarWhereWithAggregatesInput | AIPromptScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'AIPrompt'> | string;
    name?: StringWithAggregatesFilter<'AIPrompt'> | string;
    template?: StringWithAggregatesFilter<'AIPrompt'> | string;
    created_at?: DateTimeWithAggregatesFilter<'AIPrompt'> | Date | string;
    updated_at?: DateTimeWithAggregatesFilter<'AIPrompt'> | Date | string;
  };

  export type UserCreateInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    riddles?: RiddlesCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutUserInput;
    likes?: LikeCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    riddles?: RiddlesUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput;
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    riddles?: RiddlesUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutUserNestedInput;
    likes?: LikeUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    riddles?: RiddlesUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SessionCreateInput = {
    id?: string;
    token: string;
    refresh_token?: string | null;
    created_at?: Date | string;
    last_activity_at?: Date | string | null;
    expires_at?: Date | string;
    user: UserCreateNestedOneWithoutSessionsInput;
  };

  export type SessionUncheckedCreateInput = {
    id?: string;
    token: string;
    refresh_token?: string | null;
    created_at?: Date | string;
    last_activity_at?: Date | string | null;
    expires_at?: Date | string;
    userId: string;
  };

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    last_activity_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput;
  };

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    last_activity_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type SessionCreateManyInput = {
    id?: string;
    token: string;
    refresh_token?: string | null;
    created_at?: Date | string;
    last_activity_at?: Date | string | null;
    expires_at?: Date | string;
    userId: string;
  };

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    last_activity_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    last_activity_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    userId?: StringFieldUpdateOperationsInput | string;
  };

  export type RiddlesCreateInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    author: UserCreateNestedOneWithoutRiddlesInput;
    comments?: CommentCreateNestedManyWithoutRiddleInput;
    likes?: LikeCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesUncheckedCreateInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    author_id: string;
    comments?: CommentUncheckedCreateNestedManyWithoutRiddleInput;
    likes?: LikeUncheckedCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    author?: UserUpdateOneRequiredWithoutRiddlesNestedInput;
    comments?: CommentUpdateManyWithoutRiddleNestedInput;
    likes?: LikeUpdateManyWithoutRiddleNestedInput;
  };

  export type RiddlesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    author_id?: StringFieldUpdateOperationsInput | string;
    comments?: CommentUncheckedUpdateManyWithoutRiddleNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutRiddleNestedInput;
  };

  export type RiddlesCreateManyInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    author_id: string;
  };

  export type RiddlesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RiddlesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    author_id?: StringFieldUpdateOperationsInput | string;
  };

  export type CommentCreateInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    user: UserCreateNestedOneWithoutCommentsInput;
    riddle: RiddlesCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    user_id: string;
    riddle_id: string;
  };

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput;
    riddle?: RiddlesUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type CommentCreateManyInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    user_id: string;
    riddle_id: string;
  };

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type LikeCreateInput = {
    id?: string;
    created_at?: Date | string;
    user: UserCreateNestedOneWithoutLikesInput;
    riddle: RiddlesCreateNestedOneWithoutLikesInput;
  };

  export type LikeUncheckedCreateInput = {
    id?: string;
    created_at?: Date | string;
    user_id: string;
    riddle_id: string;
  };

  export type LikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutLikesNestedInput;
    riddle?: RiddlesUpdateOneRequiredWithoutLikesNestedInput;
  };

  export type LikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type LikeCreateManyInput = {
    id?: string;
    created_at?: Date | string;
    user_id: string;
    riddle_id: string;
  };

  export type LikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type AIPromptCreateInput = {
    id?: string;
    name: string;
    template: string;
    created_at?: Date | string;
    updated_at?: Date | string;
  };

  export type AIPromptUncheckedCreateInput = {
    id?: string;
    name: string;
    template: string;
    created_at?: Date | string;
    updated_at?: Date | string;
  };

  export type AIPromptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    template?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AIPromptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    template?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AIPromptCreateManyInput = {
    id?: string;
    name: string;
    template: string;
    created_at?: Date | string;
    updated_at?: Date | string;
  };

  export type AIPromptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    template?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AIPromptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    template?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type SessionListRelationFilter = {
    every?: SessionWhereInput;
    some?: SessionWhereInput;
    none?: SessionWhereInput;
  };

  export type RiddlesListRelationFilter = {
    every?: RiddlesWhereInput;
    some?: RiddlesWhereInput;
    none?: RiddlesWhereInput;
  };

  export type CommentListRelationFilter = {
    every?: CommentWhereInput;
    some?: CommentWhereInput;
    none?: CommentWhereInput;
  };

  export type LikeListRelationFilter = {
    every?: LikeWhereInput;
    some?: LikeWhereInput;
    none?: LikeWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type RiddlesOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type LikeOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    onboarding_completed?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    onboarding_completed?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    name?: SortOrder;
    onboarding_completed?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder;
    token?: SortOrder;
    refresh_token?: SortOrder;
    created_at?: SortOrder;
    last_activity_at?: SortOrder;
    expires_at?: SortOrder;
    userId?: SortOrder;
  };

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder;
    token?: SortOrder;
    refresh_token?: SortOrder;
    created_at?: SortOrder;
    last_activity_at?: SortOrder;
    expires_at?: SortOrder;
    userId?: SortOrder;
  };

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder;
    token?: SortOrder;
    refresh_token?: SortOrder;
    created_at?: SortOrder;
    last_activity_at?: SortOrder;
    expires_at?: SortOrder;
    userId?: SortOrder;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type RiddlesCountOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    answer?: SortOrder;
    prompt_context?: SortOrder;
    is_public?: SortOrder;
    is_verified?: SortOrder;
    likes_count?: SortOrder;
    comments_count?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    author_id?: SortOrder;
  };

  export type RiddlesAvgOrderByAggregateInput = {
    likes_count?: SortOrder;
    comments_count?: SortOrder;
  };

  export type RiddlesMaxOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    answer?: SortOrder;
    is_public?: SortOrder;
    is_verified?: SortOrder;
    likes_count?: SortOrder;
    comments_count?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    author_id?: SortOrder;
  };

  export type RiddlesMinOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    answer?: SortOrder;
    is_public?: SortOrder;
    is_verified?: SortOrder;
    likes_count?: SortOrder;
    comments_count?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    author_id?: SortOrder;
  };

  export type RiddlesSumOrderByAggregateInput = {
    likes_count?: SortOrder;
    comments_count?: SortOrder;
  };
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedJsonNullableFilter<$PrismaModel>;
    _max?: NestedJsonNullableFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type RiddlesScalarRelationFilter = {
    is?: RiddlesWhereInput;
    isNot?: RiddlesWhereInput;
  };

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
  };

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
  };

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
  };

  export type LikeUser_idRiddle_idCompoundUniqueInput = {
    user_id: string;
    riddle_id: string;
  };

  export type LikeCountOrderByAggregateInput = {
    id?: SortOrder;
    created_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
  };

  export type LikeMaxOrderByAggregateInput = {
    id?: SortOrder;
    created_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
  };

  export type LikeMinOrderByAggregateInput = {
    id?: SortOrder;
    created_at?: SortOrder;
    user_id?: SortOrder;
    riddle_id?: SortOrder;
  };

  export type AIPromptCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    template?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type AIPromptMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    template?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type AIPromptMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    template?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type SessionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };

  export type RiddlesCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<RiddlesCreateWithoutAuthorInput, RiddlesUncheckedCreateWithoutAuthorInput>
      | RiddlesCreateWithoutAuthorInput[]
      | RiddlesUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | RiddlesCreateOrConnectWithoutAuthorInput
      | RiddlesCreateOrConnectWithoutAuthorInput[];
    createMany?: RiddlesCreateManyAuthorInputEnvelope;
    connect?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
  };

  export type CommentCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
      | CommentCreateWithoutUserInput[]
      | CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutUserInput
      | CommentCreateOrConnectWithoutUserInput[];
    createMany?: CommentCreateManyUserInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
      | LikeCreateWithoutUserInput[]
      | LikeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[];
    createMany?: LikeCreateManyUserInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };

  export type RiddlesUncheckedCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<RiddlesCreateWithoutAuthorInput, RiddlesUncheckedCreateWithoutAuthorInput>
      | RiddlesCreateWithoutAuthorInput[]
      | RiddlesUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | RiddlesCreateOrConnectWithoutAuthorInput
      | RiddlesCreateOrConnectWithoutAuthorInput[];
    createMany?: RiddlesCreateManyAuthorInputEnvelope;
    connect?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
  };

  export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
      | CommentCreateWithoutUserInput[]
      | CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutUserInput
      | CommentCreateOrConnectWithoutUserInput[];
    createMany?: CommentCreateManyUserInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
      | LikeCreateWithoutUserInput[]
      | LikeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[];
    createMany?: LikeCreateManyUserInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };

  export type RiddlesUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<RiddlesCreateWithoutAuthorInput, RiddlesUncheckedCreateWithoutAuthorInput>
      | RiddlesCreateWithoutAuthorInput[]
      | RiddlesUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | RiddlesCreateOrConnectWithoutAuthorInput
      | RiddlesCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | RiddlesUpsertWithWhereUniqueWithoutAuthorInput
      | RiddlesUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: RiddlesCreateManyAuthorInputEnvelope;
    set?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    disconnect?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    delete?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    connect?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    update?:
      | RiddlesUpdateWithWhereUniqueWithoutAuthorInput
      | RiddlesUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | RiddlesUpdateManyWithWhereWithoutAuthorInput
      | RiddlesUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: RiddlesScalarWhereInput | RiddlesScalarWhereInput[];
  };

  export type CommentUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
      | CommentCreateWithoutUserInput[]
      | CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutUserInput
      | CommentCreateOrConnectWithoutUserInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutUserInput
      | CommentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: CommentCreateManyUserInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutUserInput
      | CommentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutUserInput
      | CommentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
      | LikeCreateWithoutUserInput[]
      | LikeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutUserInput
      | LikeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: LikeCreateManyUserInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutUserInput
      | LikeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutUserInput
      | LikeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };

  export type RiddlesUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<RiddlesCreateWithoutAuthorInput, RiddlesUncheckedCreateWithoutAuthorInput>
      | RiddlesCreateWithoutAuthorInput[]
      | RiddlesUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | RiddlesCreateOrConnectWithoutAuthorInput
      | RiddlesCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | RiddlesUpsertWithWhereUniqueWithoutAuthorInput
      | RiddlesUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: RiddlesCreateManyAuthorInputEnvelope;
    set?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    disconnect?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    delete?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    connect?: RiddlesWhereUniqueInput | RiddlesWhereUniqueInput[];
    update?:
      | RiddlesUpdateWithWhereUniqueWithoutAuthorInput
      | RiddlesUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | RiddlesUpdateManyWithWhereWithoutAuthorInput
      | RiddlesUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: RiddlesScalarWhereInput | RiddlesScalarWhereInput[];
  };

  export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
      | CommentCreateWithoutUserInput[]
      | CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutUserInput
      | CommentCreateOrConnectWithoutUserInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutUserInput
      | CommentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: CommentCreateManyUserInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutUserInput
      | CommentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutUserInput
      | CommentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>
      | LikeCreateWithoutUserInput[]
      | LikeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: LikeCreateOrConnectWithoutUserInput | LikeCreateOrConnectWithoutUserInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutUserInput
      | LikeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: LikeCreateManyUserInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutUserInput
      | LikeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutUserInput
      | LikeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    upsert?: UserUpsertWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>,
      UserUncheckedUpdateWithoutSessionsInput
    >;
  };

  export type UserCreateNestedOneWithoutRiddlesInput = {
    create?: XOR<UserCreateWithoutRiddlesInput, UserUncheckedCreateWithoutRiddlesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutRiddlesInput;
    connect?: UserWhereUniqueInput;
  };

  export type CommentCreateNestedManyWithoutRiddleInput = {
    create?:
      | XOR<CommentCreateWithoutRiddleInput, CommentUncheckedCreateWithoutRiddleInput>
      | CommentCreateWithoutRiddleInput[]
      | CommentUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutRiddleInput
      | CommentCreateOrConnectWithoutRiddleInput[];
    createMany?: CommentCreateManyRiddleInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeCreateNestedManyWithoutRiddleInput = {
    create?:
      | XOR<LikeCreateWithoutRiddleInput, LikeUncheckedCreateWithoutRiddleInput>
      | LikeCreateWithoutRiddleInput[]
      | LikeUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutRiddleInput
      | LikeCreateOrConnectWithoutRiddleInput[];
    createMany?: LikeCreateManyRiddleInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type CommentUncheckedCreateNestedManyWithoutRiddleInput = {
    create?:
      | XOR<CommentCreateWithoutRiddleInput, CommentUncheckedCreateWithoutRiddleInput>
      | CommentCreateWithoutRiddleInput[]
      | CommentUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutRiddleInput
      | CommentCreateOrConnectWithoutRiddleInput[];
    createMany?: CommentCreateManyRiddleInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeUncheckedCreateNestedManyWithoutRiddleInput = {
    create?:
      | XOR<LikeCreateWithoutRiddleInput, LikeUncheckedCreateWithoutRiddleInput>
      | LikeCreateWithoutRiddleInput[]
      | LikeUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutRiddleInput
      | LikeCreateOrConnectWithoutRiddleInput[];
    createMany?: LikeCreateManyRiddleInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type UserUpdateOneRequiredWithoutRiddlesNestedInput = {
    create?: XOR<UserCreateWithoutRiddlesInput, UserUncheckedCreateWithoutRiddlesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutRiddlesInput;
    upsert?: UserUpsertWithoutRiddlesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutRiddlesInput, UserUpdateWithoutRiddlesInput>,
      UserUncheckedUpdateWithoutRiddlesInput
    >;
  };

  export type CommentUpdateManyWithoutRiddleNestedInput = {
    create?:
      | XOR<CommentCreateWithoutRiddleInput, CommentUncheckedCreateWithoutRiddleInput>
      | CommentCreateWithoutRiddleInput[]
      | CommentUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutRiddleInput
      | CommentCreateOrConnectWithoutRiddleInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutRiddleInput
      | CommentUpsertWithWhereUniqueWithoutRiddleInput[];
    createMany?: CommentCreateManyRiddleInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutRiddleInput
      | CommentUpdateWithWhereUniqueWithoutRiddleInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutRiddleInput
      | CommentUpdateManyWithWhereWithoutRiddleInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUpdateManyWithoutRiddleNestedInput = {
    create?:
      | XOR<LikeCreateWithoutRiddleInput, LikeUncheckedCreateWithoutRiddleInput>
      | LikeCreateWithoutRiddleInput[]
      | LikeUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutRiddleInput
      | LikeCreateOrConnectWithoutRiddleInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutRiddleInput
      | LikeUpsertWithWhereUniqueWithoutRiddleInput[];
    createMany?: LikeCreateManyRiddleInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutRiddleInput
      | LikeUpdateWithWhereUniqueWithoutRiddleInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutRiddleInput
      | LikeUpdateManyWithWhereWithoutRiddleInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type CommentUncheckedUpdateManyWithoutRiddleNestedInput = {
    create?:
      | XOR<CommentCreateWithoutRiddleInput, CommentUncheckedCreateWithoutRiddleInput>
      | CommentCreateWithoutRiddleInput[]
      | CommentUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutRiddleInput
      | CommentCreateOrConnectWithoutRiddleInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutRiddleInput
      | CommentUpsertWithWhereUniqueWithoutRiddleInput[];
    createMany?: CommentCreateManyRiddleInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutRiddleInput
      | CommentUpdateWithWhereUniqueWithoutRiddleInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutRiddleInput
      | CommentUpdateManyWithWhereWithoutRiddleInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUncheckedUpdateManyWithoutRiddleNestedInput = {
    create?:
      | XOR<LikeCreateWithoutRiddleInput, LikeUncheckedCreateWithoutRiddleInput>
      | LikeCreateWithoutRiddleInput[]
      | LikeUncheckedCreateWithoutRiddleInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutRiddleInput
      | LikeCreateOrConnectWithoutRiddleInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutRiddleInput
      | LikeUpsertWithWhereUniqueWithoutRiddleInput[];
    createMany?: LikeCreateManyRiddleInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutRiddleInput
      | LikeUpdateWithWhereUniqueWithoutRiddleInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutRiddleInput
      | LikeUpdateManyWithWhereWithoutRiddleInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutCommentsInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput;
    connect?: UserWhereUniqueInput;
  };

  export type RiddlesCreateNestedOneWithoutCommentsInput = {
    create?: XOR<RiddlesCreateWithoutCommentsInput, RiddlesUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: RiddlesCreateOrConnectWithoutCommentsInput;
    connect?: RiddlesWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput;
    upsert?: UserUpsertWithoutCommentsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutCommentsInput, UserUpdateWithoutCommentsInput>,
      UserUncheckedUpdateWithoutCommentsInput
    >;
  };

  export type RiddlesUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<RiddlesCreateWithoutCommentsInput, RiddlesUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: RiddlesCreateOrConnectWithoutCommentsInput;
    upsert?: RiddlesUpsertWithoutCommentsInput;
    connect?: RiddlesWhereUniqueInput;
    update?: XOR<
      XOR<RiddlesUpdateToOneWithWhereWithoutCommentsInput, RiddlesUpdateWithoutCommentsInput>,
      RiddlesUncheckedUpdateWithoutCommentsInput
    >;
  };

  export type UserCreateNestedOneWithoutLikesInput = {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput;
    connect?: UserWhereUniqueInput;
  };

  export type RiddlesCreateNestedOneWithoutLikesInput = {
    create?: XOR<RiddlesCreateWithoutLikesInput, RiddlesUncheckedCreateWithoutLikesInput>;
    connectOrCreate?: RiddlesCreateOrConnectWithoutLikesInput;
    connect?: RiddlesWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>;
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput;
    upsert?: UserUpsertWithoutLikesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<UserUpdateToOneWithWhereWithoutLikesInput, UserUpdateWithoutLikesInput>,
      UserUncheckedUpdateWithoutLikesInput
    >;
  };

  export type RiddlesUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<RiddlesCreateWithoutLikesInput, RiddlesUncheckedCreateWithoutLikesInput>;
    connectOrCreate?: RiddlesCreateOrConnectWithoutLikesInput;
    upsert?: RiddlesUpsertWithoutLikesInput;
    connect?: RiddlesWhereUniqueInput;
    update?: XOR<
      XOR<RiddlesUpdateToOneWithWhereWithoutLikesInput, RiddlesUpdateWithoutLikesInput>,
      RiddlesUncheckedUpdateWithoutLikesInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type SessionCreateWithoutUserInput = {
    id?: string;
    token: string;
    refresh_token?: string | null;
    created_at?: Date | string;
    last_activity_at?: Date | string | null;
    expires_at?: Date | string;
  };

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string;
    token: string;
    refresh_token?: string | null;
    created_at?: Date | string;
    last_activity_at?: Date | string | null;
    expires_at?: Date | string;
  };

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput;
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>;
  };

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type RiddlesCreateWithoutAuthorInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    comments?: CommentCreateNestedManyWithoutRiddleInput;
    likes?: LikeCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesUncheckedCreateWithoutAuthorInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    comments?: CommentUncheckedCreateNestedManyWithoutRiddleInput;
    likes?: LikeUncheckedCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesCreateOrConnectWithoutAuthorInput = {
    where: RiddlesWhereUniqueInput;
    create: XOR<RiddlesCreateWithoutAuthorInput, RiddlesUncheckedCreateWithoutAuthorInput>;
  };

  export type RiddlesCreateManyAuthorInputEnvelope = {
    data: RiddlesCreateManyAuthorInput | RiddlesCreateManyAuthorInput[];
    skipDuplicates?: boolean;
  };

  export type CommentCreateWithoutUserInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    riddle: RiddlesCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateWithoutUserInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    riddle_id: string;
  };

  export type CommentCreateOrConnectWithoutUserInput = {
    where: CommentWhereUniqueInput;
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>;
  };

  export type CommentCreateManyUserInputEnvelope = {
    data: CommentCreateManyUserInput | CommentCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type LikeCreateWithoutUserInput = {
    id?: string;
    created_at?: Date | string;
    riddle: RiddlesCreateNestedOneWithoutLikesInput;
  };

  export type LikeUncheckedCreateWithoutUserInput = {
    id?: string;
    created_at?: Date | string;
    riddle_id: string;
  };

  export type LikeCreateOrConnectWithoutUserInput = {
    where: LikeWhereUniqueInput;
    create: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>;
  };

  export type LikeCreateManyUserInputEnvelope = {
    data: LikeCreateManyUserInput | LikeCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>;
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>;
  };

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>;
  };

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput;
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>;
  };

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[];
    OR?: SessionScalarWhereInput[];
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[];
    id?: StringFilter<'Session'> | string;
    token?: StringFilter<'Session'> | string;
    refresh_token?: StringNullableFilter<'Session'> | string | null;
    created_at?: DateTimeFilter<'Session'> | Date | string;
    last_activity_at?: DateTimeNullableFilter<'Session'> | Date | string | null;
    expires_at?: DateTimeFilter<'Session'> | Date | string;
    userId?: StringFilter<'Session'> | string;
  };

  export type RiddlesUpsertWithWhereUniqueWithoutAuthorInput = {
    where: RiddlesWhereUniqueInput;
    update: XOR<RiddlesUpdateWithoutAuthorInput, RiddlesUncheckedUpdateWithoutAuthorInput>;
    create: XOR<RiddlesCreateWithoutAuthorInput, RiddlesUncheckedCreateWithoutAuthorInput>;
  };

  export type RiddlesUpdateWithWhereUniqueWithoutAuthorInput = {
    where: RiddlesWhereUniqueInput;
    data: XOR<RiddlesUpdateWithoutAuthorInput, RiddlesUncheckedUpdateWithoutAuthorInput>;
  };

  export type RiddlesUpdateManyWithWhereWithoutAuthorInput = {
    where: RiddlesScalarWhereInput;
    data: XOR<RiddlesUpdateManyMutationInput, RiddlesUncheckedUpdateManyWithoutAuthorInput>;
  };

  export type RiddlesScalarWhereInput = {
    AND?: RiddlesScalarWhereInput | RiddlesScalarWhereInput[];
    OR?: RiddlesScalarWhereInput[];
    NOT?: RiddlesScalarWhereInput | RiddlesScalarWhereInput[];
    id?: StringFilter<'Riddles'> | string;
    content?: StringFilter<'Riddles'> | string;
    answer?: StringFilter<'Riddles'> | string;
    prompt_context?: JsonNullableFilter<'Riddles'>;
    is_public?: BoolFilter<'Riddles'> | boolean;
    is_verified?: BoolFilter<'Riddles'> | boolean;
    likes_count?: IntFilter<'Riddles'> | number;
    comments_count?: IntFilter<'Riddles'> | number;
    created_at?: DateTimeFilter<'Riddles'> | Date | string;
    updated_at?: DateTimeFilter<'Riddles'> | Date | string;
    author_id?: StringFilter<'Riddles'> | string;
  };

  export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput;
    update: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>;
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>;
  };

  export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput;
    data: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>;
  };

  export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: CommentScalarWhereInput;
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutUserInput>;
  };

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[];
    OR?: CommentScalarWhereInput[];
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[];
    id?: StringFilter<'Comment'> | string;
    content?: StringFilter<'Comment'> | string;
    created_at?: DateTimeFilter<'Comment'> | Date | string;
    updated_at?: DateTimeFilter<'Comment'> | Date | string;
    user_id?: StringFilter<'Comment'> | string;
    riddle_id?: StringFilter<'Comment'> | string;
  };

  export type LikeUpsertWithWhereUniqueWithoutUserInput = {
    where: LikeWhereUniqueInput;
    update: XOR<LikeUpdateWithoutUserInput, LikeUncheckedUpdateWithoutUserInput>;
    create: XOR<LikeCreateWithoutUserInput, LikeUncheckedCreateWithoutUserInput>;
  };

  export type LikeUpdateWithWhereUniqueWithoutUserInput = {
    where: LikeWhereUniqueInput;
    data: XOR<LikeUpdateWithoutUserInput, LikeUncheckedUpdateWithoutUserInput>;
  };

  export type LikeUpdateManyWithWhereWithoutUserInput = {
    where: LikeScalarWhereInput;
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyWithoutUserInput>;
  };

  export type LikeScalarWhereInput = {
    AND?: LikeScalarWhereInput | LikeScalarWhereInput[];
    OR?: LikeScalarWhereInput[];
    NOT?: LikeScalarWhereInput | LikeScalarWhereInput[];
    id?: StringFilter<'Like'> | string;
    created_at?: DateTimeFilter<'Like'> | Date | string;
    user_id?: StringFilter<'Like'> | string;
    riddle_id?: StringFilter<'Like'> | string;
  };

  export type UserCreateWithoutSessionsInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    riddles?: RiddlesCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutUserInput;
    likes?: LikeCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    riddles?: RiddlesUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput;
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
  };

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>;
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>;
  };

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddles?: RiddlesUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutUserNestedInput;
    likes?: LikeUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddles?: RiddlesUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type UserCreateWithoutRiddlesInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    comments?: CommentCreateNestedManyWithoutUserInput;
    likes?: LikeCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutRiddlesInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput;
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutRiddlesInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutRiddlesInput, UserUncheckedCreateWithoutRiddlesInput>;
  };

  export type CommentCreateWithoutRiddleInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    user: UserCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateWithoutRiddleInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    user_id: string;
  };

  export type CommentCreateOrConnectWithoutRiddleInput = {
    where: CommentWhereUniqueInput;
    create: XOR<CommentCreateWithoutRiddleInput, CommentUncheckedCreateWithoutRiddleInput>;
  };

  export type CommentCreateManyRiddleInputEnvelope = {
    data: CommentCreateManyRiddleInput | CommentCreateManyRiddleInput[];
    skipDuplicates?: boolean;
  };

  export type LikeCreateWithoutRiddleInput = {
    id?: string;
    created_at?: Date | string;
    user: UserCreateNestedOneWithoutLikesInput;
  };

  export type LikeUncheckedCreateWithoutRiddleInput = {
    id?: string;
    created_at?: Date | string;
    user_id: string;
  };

  export type LikeCreateOrConnectWithoutRiddleInput = {
    where: LikeWhereUniqueInput;
    create: XOR<LikeCreateWithoutRiddleInput, LikeUncheckedCreateWithoutRiddleInput>;
  };

  export type LikeCreateManyRiddleInputEnvelope = {
    data: LikeCreateManyRiddleInput | LikeCreateManyRiddleInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutRiddlesInput = {
    update: XOR<UserUpdateWithoutRiddlesInput, UserUncheckedUpdateWithoutRiddlesInput>;
    create: XOR<UserCreateWithoutRiddlesInput, UserUncheckedCreateWithoutRiddlesInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutRiddlesInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutRiddlesInput, UserUncheckedUpdateWithoutRiddlesInput>;
  };

  export type UserUpdateWithoutRiddlesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    comments?: CommentUpdateManyWithoutUserNestedInput;
    likes?: LikeUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutRiddlesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type CommentUpsertWithWhereUniqueWithoutRiddleInput = {
    where: CommentWhereUniqueInput;
    update: XOR<CommentUpdateWithoutRiddleInput, CommentUncheckedUpdateWithoutRiddleInput>;
    create: XOR<CommentCreateWithoutRiddleInput, CommentUncheckedCreateWithoutRiddleInput>;
  };

  export type CommentUpdateWithWhereUniqueWithoutRiddleInput = {
    where: CommentWhereUniqueInput;
    data: XOR<CommentUpdateWithoutRiddleInput, CommentUncheckedUpdateWithoutRiddleInput>;
  };

  export type CommentUpdateManyWithWhereWithoutRiddleInput = {
    where: CommentScalarWhereInput;
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutRiddleInput>;
  };

  export type LikeUpsertWithWhereUniqueWithoutRiddleInput = {
    where: LikeWhereUniqueInput;
    update: XOR<LikeUpdateWithoutRiddleInput, LikeUncheckedUpdateWithoutRiddleInput>;
    create: XOR<LikeCreateWithoutRiddleInput, LikeUncheckedCreateWithoutRiddleInput>;
  };

  export type LikeUpdateWithWhereUniqueWithoutRiddleInput = {
    where: LikeWhereUniqueInput;
    data: XOR<LikeUpdateWithoutRiddleInput, LikeUncheckedUpdateWithoutRiddleInput>;
  };

  export type LikeUpdateManyWithWhereWithoutRiddleInput = {
    where: LikeScalarWhereInput;
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyWithoutRiddleInput>;
  };

  export type UserCreateWithoutCommentsInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    riddles?: RiddlesCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutCommentsInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    riddles?: RiddlesUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutCommentsInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>;
  };

  export type RiddlesCreateWithoutCommentsInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    author: UserCreateNestedOneWithoutRiddlesInput;
    likes?: LikeCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesUncheckedCreateWithoutCommentsInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    author_id: string;
    likes?: LikeUncheckedCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesCreateOrConnectWithoutCommentsInput = {
    where: RiddlesWhereUniqueInput;
    create: XOR<RiddlesCreateWithoutCommentsInput, RiddlesUncheckedCreateWithoutCommentsInput>;
  };

  export type UserUpsertWithoutCommentsInput = {
    update: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>;
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>;
  };

  export type UserUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    riddles?: RiddlesUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    riddles?: RiddlesUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type RiddlesUpsertWithoutCommentsInput = {
    update: XOR<RiddlesUpdateWithoutCommentsInput, RiddlesUncheckedUpdateWithoutCommentsInput>;
    create: XOR<RiddlesCreateWithoutCommentsInput, RiddlesUncheckedCreateWithoutCommentsInput>;
    where?: RiddlesWhereInput;
  };

  export type RiddlesUpdateToOneWithWhereWithoutCommentsInput = {
    where?: RiddlesWhereInput;
    data: XOR<RiddlesUpdateWithoutCommentsInput, RiddlesUncheckedUpdateWithoutCommentsInput>;
  };

  export type RiddlesUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    author?: UserUpdateOneRequiredWithoutRiddlesNestedInput;
    likes?: LikeUpdateManyWithoutRiddleNestedInput;
  };

  export type RiddlesUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    author_id?: StringFieldUpdateOperationsInput | string;
    likes?: LikeUncheckedUpdateManyWithoutRiddleNestedInput;
  };

  export type UserCreateWithoutLikesInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    riddles?: RiddlesCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutUserInput;
  };

  export type UserUncheckedCreateWithoutLikesInput = {
    id?: string;
    email: string;
    password?: string;
    name?: string | null;
    onboarding_completed?: boolean | null;
    created_at?: Date | string;
    updated_at?: Date | string;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    riddles?: RiddlesUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput;
  };

  export type UserCreateOrConnectWithoutLikesInput = {
    where: UserWhereUniqueInput;
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>;
  };

  export type RiddlesCreateWithoutLikesInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    author: UserCreateNestedOneWithoutRiddlesInput;
    comments?: CommentCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesUncheckedCreateWithoutLikesInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    author_id: string;
    comments?: CommentUncheckedCreateNestedManyWithoutRiddleInput;
  };

  export type RiddlesCreateOrConnectWithoutLikesInput = {
    where: RiddlesWhereUniqueInput;
    create: XOR<RiddlesCreateWithoutLikesInput, RiddlesUncheckedCreateWithoutLikesInput>;
  };

  export type UserUpsertWithoutLikesInput = {
    update: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>;
    create: XOR<UserCreateWithoutLikesInput, UserUncheckedCreateWithoutLikesInput>;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutLikesInput = {
    where?: UserWhereInput;
    data: XOR<UserUpdateWithoutLikesInput, UserUncheckedUpdateWithoutLikesInput>;
  };

  export type UserUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    riddles?: RiddlesUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutUserNestedInput;
  };

  export type UserUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    onboarding_completed?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    riddles?: RiddlesUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput;
  };

  export type RiddlesUpsertWithoutLikesInput = {
    update: XOR<RiddlesUpdateWithoutLikesInput, RiddlesUncheckedUpdateWithoutLikesInput>;
    create: XOR<RiddlesCreateWithoutLikesInput, RiddlesUncheckedCreateWithoutLikesInput>;
    where?: RiddlesWhereInput;
  };

  export type RiddlesUpdateToOneWithWhereWithoutLikesInput = {
    where?: RiddlesWhereInput;
    data: XOR<RiddlesUpdateWithoutLikesInput, RiddlesUncheckedUpdateWithoutLikesInput>;
  };

  export type RiddlesUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    author?: UserUpdateOneRequiredWithoutRiddlesNestedInput;
    comments?: CommentUpdateManyWithoutRiddleNestedInput;
  };

  export type RiddlesUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    author_id?: StringFieldUpdateOperationsInput | string;
    comments?: CommentUncheckedUpdateManyWithoutRiddleNestedInput;
  };

  export type SessionCreateManyUserInput = {
    id?: string;
    token: string;
    refresh_token?: string | null;
    created_at?: Date | string;
    last_activity_at?: Date | string | null;
    expires_at?: Date | string;
  };

  export type RiddlesCreateManyAuthorInput = {
    id?: string;
    content: string;
    answer: string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: boolean;
    is_verified?: boolean;
    likes_count?: number;
    comments_count?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
  };

  export type CommentCreateManyUserInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    riddle_id: string;
  };

  export type LikeCreateManyUserInput = {
    id?: string;
    created_at?: Date | string;
    riddle_id: string;
  };

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    last_activity_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    last_activity_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    last_activity_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RiddlesUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    comments?: CommentUpdateManyWithoutRiddleNestedInput;
    likes?: LikeUpdateManyWithoutRiddleNestedInput;
  };

  export type RiddlesUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    comments?: CommentUncheckedUpdateManyWithoutRiddleNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutRiddleNestedInput;
  };

  export type RiddlesUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    answer?: StringFieldUpdateOperationsInput | string;
    prompt_context?: NullableJsonNullValueInput | InputJsonValue;
    is_public?: BoolFieldUpdateOperationsInput | boolean;
    is_verified?: BoolFieldUpdateOperationsInput | boolean;
    likes_count?: IntFieldUpdateOperationsInput | number;
    comments_count?: IntFieldUpdateOperationsInput | number;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CommentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddle?: RiddlesUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type LikeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddle?: RiddlesUpdateOneRequiredWithoutLikesNestedInput;
  };

  export type LikeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type LikeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    riddle_id?: StringFieldUpdateOperationsInput | string;
  };

  export type CommentCreateManyRiddleInput = {
    id?: string;
    content: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    user_id: string;
  };

  export type LikeCreateManyRiddleInput = {
    id?: string;
    created_at?: Date | string;
    user_id: string;
  };

  export type CommentUpdateWithoutRiddleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateWithoutRiddleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
  };

  export type CommentUncheckedUpdateManyWithoutRiddleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
  };

  export type LikeUpdateWithoutRiddleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutLikesNestedInput;
  };

  export type LikeUncheckedUpdateWithoutRiddleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
  };

  export type LikeUncheckedUpdateManyWithoutRiddleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string;
    user_id?: StringFieldUpdateOperationsInput | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
