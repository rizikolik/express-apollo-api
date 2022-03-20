import { gql, HttpQueryRequest } from "apollo-server-core";
import mongoose from "mongoose";

const Bike = mongoose.model("Bike");
export const resolvers = {
  Query: {
    VehicleStatus: (root: HttpQueryRequest, id?: { id: String }) =>
      new Promise((resolve, reject) => {
        const searchObj = id && id.id ? { bike_id: id.id } : {};
        Bike.find(
          searchObj,
          (err: Error, bikes: typeof Bike[] | typeof Bike) => {
            if (err) reject(err);
            else resolve(bikes);
          }
        );
      }),
  },
};
export const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  # This "Book" type defines the queryable fields for every book in our data source.
  type Bike {
    bike_id: String
    lat: Float
    lon: Float
    is_reserved: Int
    is_disabled: Int
    vehicle_type: String
    android: String
    ios: String
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    VehicleStatus(id: String): [Bike]
  }
`;
