import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
  ],
  app: {
    head: {
      title: "Trivia Quest",
      meta: [
        {
          name: "description",
          content: `Transform your online presence with our expert web development services.
                    From stunning design to seamless functionality,
                    we bring your vision to life. Get a free consultation today!`,
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABUNJREFUWEeNV1tsFVUUXXtuW4rIw0SNHyY+SgL0o4FOEUQTQY2PEGNUOlPAH42CEWMwERM/Onc6lJDwASHKhw8+RKGdW5VIDGIaBEzUAB3kwwcGA4maGHmooUQk9p5tZs7M3HPOnXvLfDR35py999p7r73OKaHpQwBY7lB+ZiYEAsfr+Vr2gwDiZqbSJnGrOZ4soPRZgKXhVzU/aVcDF79LHEQAp5ka6U4WrHi9EUillImhzD99cnxallmArld3TWu5rv1FYl4CwjwAtwH4BcRfs2WFHd9hdGTEqereit/UjhZ0otbTLPhCf2iJENZHAG7Jm1Cf+h9k0Zox39nXjFamWdqC1ETtQvrJLleWg3kvA61KuYwYkhnp31MAzY1/W6CDgrDjxICzVzeokbXmM/2mIuz293RBlMYIaG2UVUbK2roKJmWZ4HK0sS8o8hFTUo5aSgp1fGwv/ALAMtUwDfgzCPuJ8Vdsx8ANzFhOQIceJCspgYgeGhtwRk16JhXQ+yLHZH556PaSsM4aHP2HgfUnrFM74ZeFMlHo7a2UzswVa0G0FcAUaafV5/MocB/JqE6UKEgMLJtAHYbdHz4NwvvGHK8aC9yhZiSz+4efA+GdTGaUvRejwL3RtDVaICVhxYpK6cw88R6IVueJgE9HgTtHShxge+EyAu5LKlgVO49vWvlrFtT2hk8DmG3w4kIUuDcl3wy900DN9z+eVRL/fQZgsaoSYN4ebexbH9fN9iv3Q/DBzJCBP4XV1nHSf+JvCW74bYCe1xwzfRoNOo9pyp0rYQqr0w/bpgo+AvDiBKYkmMyZ6TARH0nJei+DH5A9BFAFl0AdxzY5Z2ODHm94CxNtyI6RNOmBscD1TR3XRtvur6wB8Vv1PTaHTXu/CkHPRoPOnszO9sIDAB4u6HcdhzQA3V54jICFDU6bIu79AKv6VOSvOpUt9vSHfUwoJCoDF6b+237nV1seH8/2a2Noe2Hcw5mNxMXQg8utVmne0YEVv8WlXuofahnnc2UwXkfcEZ1AebcZeOlE4O7Ipk87jGxvaByg6xVySTc5azVob0SB+3K8fM9rn0y/0n71AIGXNB7R1JbpcLTRWZbdJRIOZXrV7YWx7NpGpgYIuWoBXzL4UHoG9AC8XIZofGLIRPh8FKy8OYsqqZ7eXrrL4TpivDkZBzgxqW+UMff5q7HzUhS4M3UOEIGZ0elX4jH8FkCn3FAzVW9CcSIEDOQR5LjG/b+W52QUuAuSzibpGwd0t1+ZTYIPgXBr7LBRnlHgau2zvTAP36w2YP1kLGzYIv+DGROidR0YD4JwF4CcmFmKMQC1jAu8MO5Mckkt5IFcvAyrekfkr7pQuxEocihT0C8Gi/zdMyZE6TxAbWp94xaoxUtaYDxmJUhQ79ig86HhR81DQujxh5ZylTpLE23hsc1PXoylVYA2mOXKpbhB7yVZk5zOEeGZyHf361uNS2l8qVrghVsJeCWF9buottxttbadZ3FlNJvzOmHWpoJPAyQAzAL4JAhHqzRlW3ZQmemmSeWyALs8fAmM6bUy0foocLZ3bdg1rWVq+wiBH9UrrcHZ2zZOq7/Z5lxR7BWlqR+SOhLa3vCP8aWyNmLsRAN9I8m771u26FwLiBcA6gIwAeB7EEatKr17fND5qS6EyjajVXKctTEk2P7uuRCl+EYzB8C2KHA3Nxpuw7QmqVqda7uybFUcutQrkQx5aCIwzXc2W42zL9CByRwSWPnH81qkr37OdIY095HjufaaSDUx/3OWYUx3TY6uAlyJdTGQPKAeJn1Tq6bb/w/wnxNK/EKftQAAAABJRU5ErkJggg==",
        },
      ],
    },
  },
  css: ["~/assets/styles/main.sass"],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "~/assets/styles/_variables.sass" as *\n',
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ["vuetify"],
    },
  },
});
