import { supabase } from "../../lib/supabase";
class BaseRepository {
  table;
  constructor(table) {
    this.table = table;
  }
  get client() {
    return supabase.from(this.table);
  }
  async findAll(options) {
    let query = this.client.select("*");
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch ${this.table}: ${error.message}`);
    return data ?? [];
  }
  async findById(id) {
    const { data, error } = await this.client.select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Failed to fetch ${this.table}: ${error.message}`);
    return data;
  }
  async findByColumn(column, value) {
    const { data, error } = await this.client.select("*").eq(column, value);
    if (error) throw new Error(`Failed to fetch ${this.table}: ${error.message}`);
    return data ?? [];
  }
  async create(item) {
    const { data, error } = await this.client.insert(item).select("id").single();
    if (error) throw new Error(`Failed to create in ${this.table}: ${error.message}`);
    return { id: data?.id ?? "" };
  }
  async update(id, updates) {
    const { error } = await this.client.update(updates).eq("id", id);
    if (error) throw new Error(`Failed to update ${this.table}: ${error.message}`);
  }
  async delete(id) {
    const { error } = await this.client.delete().eq("id", id);
    if (error) throw new Error(`Failed to delete from ${this.table}: ${error.message}`);
  }
}
export {
  BaseRepository
};
