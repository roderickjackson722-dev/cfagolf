import { useDigitalProductsList } from '@/hooks/useDigitalProductsList';

/**
 * Returns the file_url for a given product_key if available.
 */
export const useToolkitFileUrl = (productKey: string) => {
  const { data: products = [] } = useDigitalProductsList();
  const product = products.find(p => p.product_key === productKey);
  return product?.file_url || null;
};
