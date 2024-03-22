import { type Ride } from '@prisma/client';
import { useState } from 'react';
import CollapsibleRide, { type Props as CollapsibleRideProps } from '~/components/CollapsibleRide';
import ToggleUser from '~/components/ToggleUser';
import { api } from '~/utils/api';

export default function Home() {
  const [rideIds] = useState<number[]>([]);

  const fetchRides = api.rides.get.useQuery(rideIds);

  // NOTE: Ride & Driver intersection assertion is congruent with Ride query payload
  const fetchRidesData = fetchRides.data as Array<CollapsibleRideProps['ride']>;

  const handleDeleteRide = async (res?: Ride) => {
    if (res) {
      await fetchRides.refetch();
    }
  };

  return (
    <div className="mx-auto p-8">
      <h4 className="mb-1 text-2xl font-bold">Login As User:</h4>

      <ToggleUser />

      <h4 className="mb-1 mt-4 text-2xl font-bold">Ride Requests:</h4>

      <div className="mb-8">
        {fetchRidesData?.length &&
          fetchRidesData.map((ride) => (
            <CollapsibleRide
              key={ride.id}
              ride={ride}
              isOpen={false}
              handleDeleteRide={handleDeleteRide}
            />
          ))}
      </div>
    </div>
  );
}
