template <typename T>
void extendArray(JsonArray* array, std::vector<T> vector = {})
{
  for(T item : vector) array->add(item);
}