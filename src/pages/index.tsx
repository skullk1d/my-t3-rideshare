import { type Collections } from '@prisma/client';
import { useState } from 'react';
import CollapsibleCollection, {
  type Props as CollapsibleCollectionProps,
} from '~/components/CollapsibleCollection';
import ToggleUser from '~/components/ToggleUser';
import { api } from '~/utils/api';

export default function Home() {
  const [collectionIds] = useState<number[]>([]);

  const fetchCollections = api.collections.get.useQuery(collectionIds);

  // NOTE: Collections & Bids intersection assertion is congruent with Collections query payload
  const fetchCollectionsData = fetchCollections.data as Array<
    CollapsibleCollectionProps['collection']
  >;

  const handleDeleteCollection = async (res?: Collections) => {
    if (res) {
      await fetchCollections.refetch();
    }
  };

  return (
    <div className="mx-auto p-8">
      <h4 className="mb-1 text-2xl font-bold">Login As User:</h4>

      <ToggleUser />

      <h4 className="mb-1 mt-4 text-2xl font-bold">Collections:</h4>

      <div className="mb-8">
        {fetchCollectionsData?.length &&
          fetchCollectionsData.map((collection) => (
            <CollapsibleCollection
              key={collection.id}
              collection={collection}
              isOpen={false}
              handleDeleteCollection={handleDeleteCollection}
            />
          ))}
      </div>
    </div>
  );
}
