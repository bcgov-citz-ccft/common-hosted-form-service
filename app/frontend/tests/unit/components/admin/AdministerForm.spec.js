import { createLocalVue, shallowMount } from '@vue/test-utils';
import AdministerForm from '@/components/admin/AdministerForm.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('AdministerForm.vue', () => {
  const mockAdminGetter = jest.fn();
  let store;
  const actions = {
    readForm: jest.fn(),
    restoreForm: jest.fn()
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        admin: {
          namespaced: true,
          getters: {
            form: mockAdminGetter
          },
          actions: actions
        }
      }
    });
  });

  afterEach(() => {
    mockAdminGetter.mockReset();
    actions.readForm.mockReset();
    actions.restoreForm.mockReset();
  });

  it('renders ', async () => {
    mockAdminGetter.mockReturnValue({ name: 'tehForm' });
    const wrapper = shallowMount(AdministerForm, {
      localVue,
      store,
      propsData: { formId: 'f' },
      stubs: ['BaseDialog']
    });
    await localVue.nextTick();

    expect(wrapper.text()).toMatch('tehForm');
    expect(actions.readForm).toHaveBeenCalledTimes(1);
  });
});
