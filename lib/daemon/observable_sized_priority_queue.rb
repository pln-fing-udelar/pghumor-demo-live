require 'rbtree'
require 'rx'

class SizedPriorityQueue
  attr_reader :max_size

  def initialize(max_size)
    super()
    @max_size = max_size
    @rbtree = RBTree.new
  end

  def size
    @rbtree.size
  end

  def push(o)
    if size < max_size
      @rbtree[o] = o
    elsif o > @rbtree.first[1]
      @rbtree.shift
      @rbtree[o] = o
    end
  end

  alias << push

  def pop
    @rbtree.pop[1]
  end

  def top
    @rbtree.last[1]
  end
end

# TODO: mutual exclusion between push and pop, and between each one of themselves?
class ObservableSizedPriorityQueue < SizedPriorityQueue
  def initialize(max_size)
    super(max_size)
  end

  def push(o)
    super
    if size == 1
      @published.connect
    end
  end

  alias << push

  def pop
    if size == 0
      @published = RX::Observable.create { |observer|
        observer.on_next(super)
        #observer.on_completed
      }.publish
    else
      RX::Observable.from_array [super]
    end
  end
end
