import type { ReactNode } from 'react';
import { Anchor } from '@mantine/core';
import { lightColor, Mono } from '@/components/Terminal/Terminal';

// Project content for the Projects page. Initially ported from old-portfolio/index.html.

export type Topic =
  | 'architecture'
  | 'distributed'
  | 'os'
  | 'compilers'
  | 'security'
  | 'parallel'
  | 'verification';

export const TOPICS: { id: Topic; label: string }[] = [
  { id: 'architecture', label: 'Computer Architecture' },
  { id: 'distributed', label: 'Distributed Systems' },
  { id: 'os', label: 'Operating Systems' },
  { id: 'compilers', label: 'Compilers' },
  { id: 'parallel', label: 'Parallel & GPU' },
  { id: 'security', label: 'Security' },
  { id: 'verification', label: 'Formal Verification' },
];

export type Project = {
  slug: string;
  title: ReactNode;
  kind: string;
  date: string;
  topics: Topic[];
  tech: string[];
  summary: string;
  links?: { label: string; href: string }[];
  // Full write-up, one entry per paragraph.
  details: ReactNode[];
};

const L = ({ href, children }: { href: string; children: ReactNode }) => (
  <Anchor
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    inherit
    c={lightColor}
    underline="hover"
  >
    {children}
  </Anchor>
);

const B = ({ children }: { children: ReactNode }) => <strong>{children}</strong>;

export const PROJECTS: Project[] = [
  {
    slug: 'sharded-paxos-kv',
    title: 'Sharded Paxos-based key/value service',
    kind: 'Academic project',
    date: 'December 2024',
    topics: ['distributed'],
    tech: ['Go', 'Paxos', 'RPC'],
    summary:
      'A fault-tolerant, sharded key/value store: Paxos replica groups own shards, and a shard master rebalances and migrates them as groups join and leave.',
    details: [
      <>
        I implemented a distributed sharded key/value storage system with fault tolerance and
        consistency using Paxos. The system partitions keys across multiple replica groups, each
        responsible for a subset of shards, with a central "shard master" managing shard
        assignments and reconfigurations.
      </>,
      <>
        I developed the shard master to handle configuration changes using <Mono>Join()</Mono>,{' '}
        <Mono>Leave()</Mono>, <Mono>Move()</Mono>, and <Mono>Query()</Mono> RPCs exposed to the
        client, ensuring even shard redistribution while maintaining fault tolerance.
      </>,
      <>
        Later on, I built the sharded key/value servers to handle client requests with single-copy
        semantics, designing a robust protocol for shard transfers during configuration changes.
        This system successfully manages dynamic reconfigurations and ensures consistency across
        all replica groups.
      </>,
    ],
  },
  {
    slug: 'cache-coherence',
    title: 'Multiprocessor cache coherence protocol',
    kind: 'Academic project',
    date: 'November 2024',
    topics: ['architecture', 'parallel', 'verification'],
    tech: ['Murphi', 'MSI'],
    summary:
      'A directory-based coherence protocol for a 4-core processor, formally verified in Murphi across a ~700,000-state space.',
    details: [
      <>
        I designed and formally verified a directory based cache coherence protocol for a 4 core
        processor. The protocol was a modification of the canonical{' '}
        <L href="https://en.wikipedia.org/wiki/MSI_protocol">MSI scheme</L> found in many computer
        architecture courses. Modifications mainly included additional handshakes and transient
        states to deal with the fact that messages could be arbitrarily reordered by the
        interconnect network.
      </>,
      <>
        Formal verification was done by encoding the replicated state machine of the processor and
        directory cache controllers in the{' '}
        <L href="https://en.wikipedia.org/wiki/Murφ">Murphi language</L> and exploring the
        ~700,000 possible states for invariant violations and deadlocks.
      </>,
    ],
  },
  {
    slug: 'paxos-kv',
    title: 'Paxos-based key/value service',
    kind: 'Academic project',
    date: 'November 2024',
    topics: ['distributed'],
    tech: ['Go', 'Paxos'],
    summary:
      'A linearizable, replicated key/value store built on a Paxos library I wrote, with no single point of failure.',
    details: [
      <>
        I implemented a Paxos-based key/value storage system that ensures high reliability and
        fault tolerance. The system replaces a single master view server with Paxos to manage
        consensus, enabling all replicas to process client requests in a consistent order without
        relying on a single point of failure.
      </>,
      <>
        My work involved designing and implementing a Paxos library that supports concurrent
        agreement across multiple instances, managing memory efficiently for forgotten instances,
        and maintaining linearizable semantics for the key/value service. The project also
        required careful handling of duplicate requests and ensuring the system could recover state
        when replicas lagged behind.
      </>,
      <>
        By layering the Paxos library, a replicated state machine, and the key/value server, I
        structured the implementation to separate concerns and simplify complexity.
      </>,
    ],
  },
  {
    slug: 'security-exploits',
    title: 'Computer security exploits',
    kind: 'Several academic projects',
    date: 'January 2024',
    topics: ['security'],
    tech: ['Python', 'x86-64', 'GDB', 'Ghidra', 'Wireshark'],
    summary:
      'Five sanctioned offensive-security projects: crypto attacks, web exploits, a breach investigation, control-flow hijacking, and digital forensics.',
    details: [
      <>
        <B>Disclaimer:</B> All computer security projects listed on this page and subsequent
        exploits were sanctioned by the University of Michigan. Any infrastructure mentioned as
        targets of exploits or breaches are owned and operated by the university for educational
        purposes.
      </>,
      <>
        <B>1.</B> In the first project, I implemented several exploits against known
        vulnerabilities in cryptosystems like MD5, SHA-1, SHA-2, and other hashes using{' '}
        <L href="https://en.wikipedia.org/wiki/Merkle%E2%80%93Damg%C3%A5rd_construction">
          Merkle-Damgård construction
        </L>
        . First, I wrote scripts which perform a length extension attack and hash collision
        attack. I also created scripts that performed padding oracle attacks on a vulnerable
        endpoint that contained encrypted communications and made the mistake of{' '}
        <L href="https://moxie.org/2011/12/13/the-cryptographic-doom-principle.html">
          doing decryption before message authentication
        </L>{' '}
        in its backend.
      </>,
      <>
        <B>2.</B> In the second project, I executed several website security exploits such as SQL
        injection, Cross-site scripting (XSS), and Cross-site request forgery (CSRF) against
        various tiers of defenses.
      </>,
      <>
        <B>3.</B> In the third project, I retraced the steps an attacker took to breach a fictional
        company's website and database. I had to employ tools like Wireshark, Python scripting, and
        networking code to find security vulnerabilities in the company's mobile device management
        (MDM) infrastructure, particularly in their DNS resolver and their multi-factor
        authentication tool.
      </>,
      <>
        <B>4.</B> In the fourth project, I exploited buffer overflows and control-flow hijacking:
        overwriting stack variables, then crafting payloads that overwrite return addresses to
        redirect execution, bypassing DEP and ASLR with GDB and <Mono>x86-64</Mono> assembly. I
        also reverse engineered a closed-source binary with Ghidra to find and exploit its
        vulnerabilities.
      </>,
      <>
        <B>5.</B> In the final project, I was tasked with performing a forensic analysis on a
        fictional cyber criminal named Leslie. I was provided with a forensic copy of his hard
        drive as well as his physical machine. In order to find incriminating evidence, I had to
        utilize a lot of the techniques from previous projects, including new ones like using
        steganography, password crackers, binwalk, spectrograms, and the Autopsy digital forensics
        software.
      </>,
    ],
  },
  {
    slug: 'ooo-processor',
    title: 'Parameterizable superscalar out-of-order processor',
    kind: 'Academic project',
    date: 'February - March 2024',
    topics: ['architecture'],
    tech: ['SystemVerilog', 'Synopsys VCS', 'RISC-V', 'React', 'Digital IC design'],
    summary:
      'A 3-way superscalar RISC-V core inspired by the MIPS R10000, with early tag broadcast, a forwarding load-store queue, and non-blocking caches.',
    links: [
      {
        label: 'Final report',
        href: 'https://drive.google.com/file/d/1RfwSQpUkooiU_X98c6q6y6mwchEE7vRl/view?usp=drive_link',
      },
    ],
    details: [
      <>
        For this project, my team and I designed and implemented a 32-bit RISCV superscalar
        out-of-order processor in behavioral SystemVerilog. Simulation and synthesis were performed
        via Synopsys VCS. Our design was inspired by the{' '}
        <L href="https://en.wikipedia.org/wiki/R10000">MIPS R10000</L> implementation of{' '}
        <L href="https://en.wikipedia.org/wiki/Tomasulo's_algorithm">Tomasulo's algorithm</L> and
        included core components like a reservation station (RS), reorder buffer (ROB), physical
        register file (PRF), and a retirement register allocation table (RRAT).
      </>,
      <>
        We chose a 3-way superscalar configuration to balance complexity and performance,
        incorporating advanced features such as early tag broadcasting (ETB), a non-speculative
        load-store queue with internal data forwarding from in flight stores to dependent loads,
        and a non-blocking L1 data cache with prefetching. ETB enabled dependent instructions to
        execute back-to-back with minimal delays, while the load-store queue effectively reduced
        memory access contention. The load-store queue handled dependency tracking with bit masks.
        Each load in the RS maintained a bit mask that indicated which stores in the Store Queue
        (SQ) were older and a second bit mask was used to track which older stores had unresolved
        addresses. This design was inspired by similar mechanisms in the{' '}
        <L href="https://docs.boom-core.org/en/latest/sections/intro-overview/boom.html">
          Berkeley Out-of-Order Machine
        </L>
        .
      </>,
      <>
        Our I$ and D$ were designed with prefetching and non-blocking mechanisms, enhancing data
        throughput. Memory handling was enhanced by implementing miss status handling registers
        (MSHRs) to reduce stalls caused by cache misses. Performance analysis revealed improvements
        in cycles per instruction (CPI) compared to baseline in-order designs, particularly on
        benchmarks leveraging instruction-level parallelism (ILP). However, challenges like cache
        aliasing and limited branch prediction accuracy highlighted areas for future improvement.
        Additionally, a React-based GUI debugger was developed to visualize all processor signals
        at every cycle of a program's execution to aid debugging. We were able to meet slack with a
        13.7ns clock period (~73MHz frequency).
      </>,
    ],
  },
  {
    slug: 'oat-compiler',
    title: (
      <>
        <Mono>C</Mono> to <Mono>x86-64</Mono> optimizing compiler
      </>
    ),
    kind: 'Several academic projects',
    date: 'January - March 2024',
    topics: ['compilers'],
    tech: ['C', 'OCaml', 'x86-64', 'LLVM IR'],
    summary:
      'An optimizing compiler for Oat, a sizeable C subset, down to x86-64: assembler, LLVM-lite backend, type system, dataflow optimizations, and graph-coloring register allocation.',
    details: [
      <>
        Over the course of several projects, I iteratively implemented an optimizing compiler which
        supported a sizeable subset of the <Mono>C</Mono> language (which we dubbed{' '}
        <Mono>Oat</Mono>) to <Mono>x86-64</Mono> machine code. The compiler was entirely
        implemented in <Mono>OCaml</Mono> and followed the{' '}
        <L href="https://wiki.osdev.org/System_V_ABI">AMD64 System V ABI</L> calling conventions.
        It was written in the following phases.
      </>,
      <>
        <B>Phase 1:</B> Implemented an assembler and simulator for a small, idealized subset of the{' '}
        <Mono>x86-64</Mono> platform that will serve as the target language for the compiler.
      </>,
      <>
        <B>Phase 2:</B> Implemented a non-optimizing compiler for a{' '}
        <L href="https://maxsnew.com/teaching/eecs-483-wn24/hw3/llvmlite.html#llvmlite">
          subset of the <Mono>LLVM</Mono> IR language
        </L>{' '}
        (dubbed <Mono>LLVMlite</Mono>) with <Mono>x86-64</Mono> as the target. At this point, the
        compiler's backend was largely completed.
      </>,
      <>
        <B>Phase 3:</B> Implemented a non-optimizing compiler for <Mono>Oat</Mono> with{' '}
        <Mono>LLVMlite</Mono> as the target. At this point, the compiler's frontend was largely
        completed and it supported compiling simple <Mono>Oat</Mono> programs.{' '}
        <L href="https://maxsnew.com/teaching/eecs-483-wn24/_downloads/5e47632c7bfbf5de04616b2dbb587d87/oat-v1.pdf">
          [Oatv1 rules]
        </L>
      </>,
      <>
        <B>Phase 4:</B> Implemented new <Mono>Oat</Mono> language features such as structs,
        function pointers, distinguishing between possibly null and definitely not null
        references, array initializers, and updating the type system for supporting all the prior
        additions.{' '}
        <L href="https://maxsnew.com/teaching/eecs-483-wn24/_downloads/cc6e255671082a548f10c34aa4ff92f5/oat-v2.pdf">
          [Oatv2 rules]
        </L>
      </>,
      <>
        <B>Phase 5:</B> Implemented compiler optimizations at the <Mono>LLVMlite</Mono> IR level in
        the backend. These included dataflow analysis, dead code elimination, constant
        propagation, and a proper register allocation heuristic instead of placing all variables
        and intermediate values on the stack. For register allocation, I chose to implement{' '}
        <L href="https://www.inf.ed.ac.uk/teaching/courses/copt/lecture-7.pdf">
          Chaitin's algorithm
        </L>{' '}
        with conservative node coalescing.
      </>,
    ],
  },
  {
    slug: 'network-file-server',
    title: 'Multithreaded network file server',
    kind: 'Academic project',
    date: 'November - December 2023',
    topics: ['os'],
    tech: ['C++', 'Boost', 'BSD sockets', 'File systems'],
    summary:
      'An ACID-compliant, multithreaded network file server for Unix with fine-grained reader-writer locking and fault-tolerant design.',
    details: [
      <>
        Implemented an <L href="https://en.wikipedia.org/wiki/ACID">ACID</L> compliant network file
        server using <Mono>C++</Mono> and the <L href="https://www.boost.org/">Boost libraries</L>{' '}
        for regex, thread, and reader-writer lock functionality.
      </>,
      <>
        The file server can be run on any Unix machine, utilizes BSD sockets for interprocess
        communication, and has several design considerations for fault tolerance.
      </>,
    ],
  },
  {
    slug: 'cnn-gpu',
    title: 'CNN forward layers optimized for Nvidia GPUs',
    kind: 'Academic project',
    date: 'November 2023',
    topics: ['parallel', 'architecture'],
    tech: ['CUDA', 'GPU programming'],
    summary:
      'Rewrote a CNN forward-pass kernel for a Tesla V100 with constant memory, coalesced access, and full batch parallelism: 13.78s → 0.17s (~81× faster).',
    details: [
      <>
        Given a pretrained convolutional neural network written in <Mono>CUDA</Mono> for
        classifying MNIST-Fashion clothing images into one of several discrete bins, I optimized
        the provided forwarding kernel (it comprised 98.95% of total execution time) by utilizing
        several GPU optimization techniques.
      </>,
      <>
        These included placing constant filter values into the GPU's constant memory (which has
        orders of magnitude less access cycles), rewriting memory access patterns such that they
        were coalesced and minimized memory bank conflicts, unrolling loops, and rewriting the
        algorithm to leverage the massive parallel compute capability of the Tesla V100 datacenter
        GPU I worked with. In fact, I was able to parallelize the work for a batch of 10,000
        images, the subsequent iterations over all output feature maps, and the iterations over
        each individual pixel.
      </>,
      <>
        In summary, although the theoretical amount of calculations did not change in any of the
        kernel invocations, it was rewritten in such a way that the V100 scheduled as much work as
        possible across its 80 streaming multiprocessors. The final kernel ran in 0.17s across both
        passes, whereas the original implementation took 13.78s in total (~81x speedup).
      </>,
    ],
  },
  {
    slug: 'vm-pager',
    title: 'Unix virtual memory pager',
    kind: 'Academic project',
    date: 'September - October 2023',
    topics: ['os'],
    tech: ['C++', 'Paging', 'Address spaces', 'System calls'],
    summary:
      'The pager of a Unix-like OS: creating, copying, growing, and destroying address spaces, fork(), and switching between processes.',
    details: [
      <>
        Implemented a simulator of the pager portion of a Unix operating system used to manage
        application processes' virtual address space.
      </>,
      <>
        The pager was written in <Mono>C++</Mono> and implemented system calls like the Unix{' '}
        <Mono>fork()</Mono> which are used to create, copy, destroy address spaces, allocate more
        space in existing ones, and switch between address spaces.
      </>,
    ],
  },
  {
    slug: 'thread-library',
    title: 'Unix thread library',
    kind: 'Academic project',
    date: 'September 2023',
    topics: ['os', 'parallel'],
    tech: ['C++', 'Concurrency', 'Mutual exclusion primitives'],
    summary:
      'A POSIX-like thread library with custom thread control blocks, preemptive scheduling, and context switching on multicore machines.',
    details: [
      <>
        Implemented a POSIX-like thread library in <Mono>C++</Mono>, enabling thread creation,
        synchronization, and context switching on multicore machines.
      </>,
      <>
        I managed threads using custom thread control blocks (TCBs) and preemptive scheduling with
        interrupt safety.
      </>,
    ],
  },
];
