<template>
  <v-table>
    <thead>
      <tr>
        <th>Код</th>
        <th>Должность</th>
        <th>Отдел</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in positions" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.position_name }}</td>
        <td>{{ item.department_name }}</td>
        <td>
          <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
          >
          <v-btn color="red" @click="openDeleteDialog(item.id)" small
            >Удалить</v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  props: {
    positions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    openEditDialog(item) {
      this.$emit("edit", item);
    },
    openDeleteDialog(id) {
      this.$emit("delete", id);
    },
  },
};
</script>
