export default {
    name: 'ResizeableDrawer',
    data() {
        return {
            drawerWidth: 300,
            drawer: true,
        }
    },
    watch: {
        drawer(val) {
            const drawerWidth = parseInt(this.drawerWidth.replace('px', ''),10);
            const sub = document.documentElement.clientWidth > 1250 ? 250 : 0;
            document.documentElement.style.setProperty('--drawer-width', val ? `${drawerWidth - sub}` :'0px');
        }
    },
    async mounted() {
        this.setBorderWidth();
        this.setEvents();
        const sub = document.documentElement.clientWidth > 1250 ? 300 : 0;
        document.documentElement.style.setProperty('--drawer-width', sub > 0 ? `${this.drawerWidth - sub}` :'0px');
    },
    methods: {
        setBorderWidth() {
            let i = this.$refs.drawer.$el.querySelector(
                ".v-navigation-drawer__border"
            );
            i.style.cursor = "ew-resize";
        },
        setEvents() {
            const minSize = 3;
            const el = this.$refs.drawer.$el;
            const drawerBorder = el.querySelector(".v-navigation-drawer__border");
            const vm = this;
            const direction = el.classList.contains("v-navigation-drawer--right")
                ? "right"
                : "left";

            function resize(e) {
                document.body.style.cursor = "ew-resize";
                let f =
                    direction === "right"
                        ? document.body.scrollWidth - e.clientX
                        : e.clientX;
                el.style.width = f + "px";
                const sub = document.documentElement.clientWidth > 1250 ? 250 : 0;
                document.documentElement.style.setProperty('--drawer-width', f-sub + "px");
            }

            drawerBorder.addEventListener(
                "mousedown",
                (e) => {
                    if (e.offsetX < minSize) {
                        el.style.transition = "initial";
                        document.addEventListener("mousemove", resize, false);
                    }
                },
                false
            );

            document.addEventListener(
                "mouseup",
                () => {
                    el.style.transition = "";
                    this.drawerWidth = el.style.width;
                    document.body.style.cursor = "";
                    document.removeEventListener("mousemove", resize, false);
                },
                false
            );
        }
    },
}
